terraform {
  backend "remote" {
    hostname = "app.terraform.io"
    organization = "wi-dif-172"

    workspaces {
      name = "praxisprojekt-devops"
    }
  }
  required_providers {
    google = {
      source = "hashicorp/google"
    }
  }
  required_version = ">= 0.13"
}