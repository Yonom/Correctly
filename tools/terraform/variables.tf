variable "gcp_project_id" { }
variable "gcp_region" { }
variable "gcp_zone" { }
variable "gcp_prod_region" { }
variable "gcp_prod_zone" { }
variable "main_vm_cockroach_alpha_nodes" { 
  type = number 
}
variable "main_vm_cockroach_prod_nodes" { 
  type = number 
}
variable "main_vm_ssh_key" { }
variable "main_vm_cockroach_migrate_pass" { }
variable "main_vm_cockroach_roach_ui_pass" { }