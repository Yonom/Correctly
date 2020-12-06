provider "google" {
  version = "~> 3.16"
  project = var.gcp_project_id
  region = var.gcp_region
  zone = var.gcp_zone
}

data "google_compute_network" "default" {
  name = "default"
}

data "google_compute_image" "cos_stable" {
  family  = "cos-81-lts"
  project = "cos-cloud"
}

resource "google_compute_disk" "data_disk" {
  name = "data-disk"
  size = 25

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      snapshot
    ]
  }
}

resource "google_compute_disk" "prod_data_disk" {
  name = "prod-data-disk"
  size = 10
  zone = var.gcp_prod_zone

  lifecycle {
    prevent_destroy = true
    ignore_changes = [
      snapshot
    ]
  }
}

resource "google_compute_resource_policy" "data_disk_resource_policy" {
  name = "data-disk-resource-policy"
  region = var.gcp_region

  snapshot_schedule_policy {
    schedule {
      daily_schedule {
        days_in_cycle = 1
        start_time = "04:00"
      }
    }

    retention_policy {
      max_retention_days    = 10
      on_source_disk_delete = "APPLY_RETENTION_POLICY"
    }
  }
}


resource "google_compute_resource_policy" "prod_data_disk_resource_policy" {
  name = "data-disk-resource-policy"
  region = var.gcp_prod_region

  snapshot_schedule_policy {
    schedule {
      daily_schedule {
        days_in_cycle = 1
        start_time = "04:00"
      }
    }

    retention_policy {
      max_retention_days    = 10
      on_source_disk_delete = "APPLY_RETENTION_POLICY"
    }
  }
}

resource "google_compute_disk_resource_policy_attachment" "data_disk_resource_policy_attachment" {
  name = google_compute_resource_policy.data_disk_resource_policy.name
  disk = google_compute_disk.data_disk.name
}
resource "google_compute_disk_resource_policy_attachment" "prod_data_disk_resource_policy_attachment" {
  name = google_compute_resource_policy.prod_data_disk_resource_policy.name
  disk = google_compute_disk.prod_data_disk.name
  zone = var.gcp_prod_zone
}

resource "google_compute_address" "main_ip" {
  name = "main-ip"
  network_tier = "STANDARD"
}

resource "google_compute_address" "prod_ip" {
  name = "prod-ip"
  region = var.gcp_prod_region
  network_tier = "STANDARD"
}

resource "google_compute_firewall" "http_server" {
  name    = "default-allow-http"
  network = data.google_compute_network.default.name

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  target_tags = ["http-server"]
}

resource "google_compute_firewall" "cockroach_server" {
  name    = "default-allow-cockroach"
  network = data.google_compute_network.default.name

  allow {
    protocol = "tcp"
    ports    = ["${var.main_vm_cockroach_alpha_nodes == 1 ? "" : "26357-"}${26257 + var.main_vm_cockroach_alpha_nodes - 1}", "${var.main_vm_cockroach_alpha_nodes == 1 ? "" : "8080-"}${8080 + var.main_vm_cockroach_alpha_nodes - 1}",
                "${var.main_vm_cockroach_prod_nodes == 1 ? "" : "26357-"}${26357 + var.main_vm_cockroach_prod_nodes - 1}", "${var.main_vm_cockroach_prod_nodes == 1 ? "" : "8180-"}${8180 + var.main_vm_cockroach_prod_nodes - 1}"]
  }

  target_tags = ["cockroach-server"]
}

resource "google_compute_instance" "main_vm" {
  name = "main-vm"
  machine_type = "n1-standard-2"
  min_cpu_platform = "Intel Skylake"
  tags = ["http-server", "cockroach-server"]

  boot_disk {
    initialize_params {
      image = data.google_compute_image.cos_stable.self_link
    }
  }

  attached_disk {
    source = google_compute_disk.data_disk.self_link
    device_name = "data-disk"
  }

  network_interface {
    network = data.google_compute_network.default.name

    access_config {
      nat_ip = google_compute_address.main_ip.address
      network_tier = "STANDARD"
    }
  }

  metadata = {
    user-data = file("${path.module}/cloud-config.yml")
    github-ssh = var.main_vm_ssh_key
    cockroach-alpha-nodes = var.main_vm_cockroach_alpha_nodes
    cockroach-prod-nodes = 0
    cockroach-migrate-pass = var.main_vm_cockroach_migrate_pass
    cockroach-roach-ui-pass = var.main_vm_cockroach_roach_ui_pass
  }
}

resource "google_compute_instance" "prod_vm" {
  name = "prod-vm"
  machine_type = "e2-small"
  zone = var.gcp_prod_zone
  tags = ["http-server", "cockroach-server"]

  boot_disk {
    initialize_params {
      image = data.google_compute_image.cos_stable.self_link
    }
  }

  attached_disk {
    source = google_compute_disk.prod_data_disk.self_link
    device_name = "data-disk"
  }

  network_interface {
    network = data.google_compute_network.default.name

    access_config {
      nat_ip = google_compute_address.prod_ip.address
      network_tier = "STANDARD"
    }
  }

  metadata = {
    user-data = file("${path.module}/cloud-config-prod.yml")
    github-ssh = var.main_vm_ssh_key
    cockroach-alpha-nodes = 0
    cockroach-prod-nodes = var.main_vm_cockroach_prod_nodes
    cockroach-migrate-pass = var.main_vm_cockroach_migrate_pass
    cockroach-roach-ui-pass = var.main_vm_cockroach_roach_ui_pass
  }
}

resource "google_cloud_scheduler_job" "alpha-distribute-job" {
  name             = "alpha-distribute-job"
  schedule         = "*/5 * * * *"
  region           = "europe-west3"

  http_target {
    http_method = "GET"
    uri         = "https://praxisprojekt.cf/api/cron/distribution"
  }
}

resource "google_cloud_scheduler_job" "prod-distribute-job" {
  name             = "prod-distribute-job"
  schedule         = "*/5 * * * *"
  region           = "europe-west3"

  http_target {
    http_method = "GET"
    uri         = "https://correctly.frankfurt.school/api/cron/distribution"
  }
}

resource "google_cloud_scheduler_job" "prod-dashboard-job" {
  name             = "prod-dashboard-job"
  schedule         = "*/5 * * * *"
  region           = "europe-west3"

  http_target {
    http_method = "GET"
    uri         = "https://correctly.frankfurt.school/api/cron/dashboard"
  }
}