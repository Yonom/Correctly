#!/bin/sh

DEV_DIR=/dev/disk/by-id/google-data-disk
MNT_DIR=/mnt/disks/data-disk

# format the drive if needed
if ! blkid $DEV_DIR;then
  mkfs.ext4 -m 0 -F -E lazy_itable_init=0,lazy_journal_init=0,discard $DEV_DIR
fi

# mount the drive
mkdir -p $MNT_DIR
mount -o discard,defaults $DEV_DIR $MNT_DIR

# Add fstab entry
echo UUID=`blkid -s UUID -o value` $DEV_DIR $MNT_DIR ext4 discard,defaults,nofail 0 2 | sudo tee -a /etc/fstab

bash ./setup.sh $COCKROACH_ALPHA_NODES $COCKROACH_PROD_NODES