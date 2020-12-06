#!/bin/bash -eux

# setup docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add correctly user to sudoers.
echo "correctly        ALL=(ALL)       NOPASSWD: ALL" >> /etc/sudoers
sed -i "s/^.*requiretty/#Defaults requiretty/" /etc/sudoers

# add correctly user to docker group
sudo usermod -aG docker correctly

# Create the working directory
mkdir /var/correctly
chown correctly /var/correctly


# motd
correctly=$'
    _________ ##   ____                               _    _        
    |        ##   / ___| ___   _ __  _ __  ___   ___ | |_ | | _   _ 
    |       ## | | |    / _ \ | \'__|| \'__|/ _ \ / __|| __|| || | | |
    | ##   ##  | | |___| (_) || |   | |  |  __/| (__ | |_ | || |_| |
    |  ## ##   |  \____|\___/ |_|   |_|   \___| \___| \__||_| \__, |
    |___###____|                                              |___/ '

if [ -d /etc/update-motd.d ]; then
    MOTD_CONFIG='/etc/update-motd.d/99-correctly'

    cat >> "$MOTD_CONFIG" <<CORRECTLY
#!/bin/sh
cat <<'EOF'
$correctly
EOF
CORRECTLY

    chmod 0755 "$MOTD_CONFIG"
else
    echo "$correctly" >> /etc/motd
fi