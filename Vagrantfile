# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Use Ubuntu 20.04 LTS (Focal) as base image
  config.vm.box = "ubuntu/focal64"
  config.vm.box_version = "20231025.0.0"
  
  # Disable automatic box update checking
  config.vm.box_check_update = false
  
  # Set hostname
  config.vm.hostname = "farm-management-dev"
  
  # Network configuration
  config.vm.network "private_network", ip: "192.168.56.10"
  
  # Provider configuration
  config.vm.provider "virtualbox" do |vb|
    vb.name = "Farm-Management-Dev"
    vb.memory = "4096"
    vb.cpus = 2
    vb.customize ["modifyvm", :id, "--ioapic", "on"]
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--cpuexecutioncap", "80"]
    
    # Enable clipboard and drag & drop
    vb.customize ["modifyvm", :id, "--clipboard", "bidirectional"]
    vb.customize ["modifyvm", :id, "--draganddrop", "bidirectional"]
  end
  
  # Synced folders
  config.vm.synced_folder ".", "/vagrant", 
    owner: "vagrant", 
    group: "vagrant",
    mount_options: ["dmode=755,fmode=644"]
  
  # Provision the VM
  config.vm.provision "shell", inline: <<-SHELL
    # Update system
    echo "Updating system packages..."
    apt-get update
    apt-get upgrade -y
    
    # Install essential packages
    echo "Installing essential packages..."
    apt-get install -y \
      curl \
      wget \
      git \
      vim \
      htop \
      unzip \
      software-properties-common \
      apt-transport-https \
      ca-certificates \
      gnupg \
      lsb-release \
      build-essential \
      python3 \
      python3-pip \
      python3-venv \
      nodejs \
      npm \
      docker.io \
      docker-compose \
      nginx \
      redis-server \
      mongodb \
      supervisor \
      cron \
      logrotate \
      fail2ban \
      ufw
    
    # Start and enable services
    systemctl start docker
    systemctl enable docker
    systemctl start redis-server
    systemctl enable redis-server
    systemctl start mongodb
    systemctl enable mongodb
    
    # Add vagrant user to docker group
    usermod -aG docker vagrant
    
    # Install Node.js 18.x
    echo "Installing Node.js 18.x..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
    
    # Install Yarn
    echo "Installing Yarn..."
    npm install -g yarn
    
    # Install PM2 globally
    echo "Installing PM2..."
    npm install -g pm2
    
    # Install Docker Compose
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Install MongoDB tools
    echo "Installing MongoDB tools..."
    wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
    apt-get update
    apt-get install -y mongodb-mongosh mongodb-database-tools
    
    # Install Jenkins
    echo "Installing Jenkins..."
    wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | apt-key add -
    echo "deb https://pkg.jenkins.io/debian-stable binary/" | tee /etc/apt/sources.list.d/jenkins.list
    apt-get update
    apt-get install -y jenkins
    
    # Start and enable Jenkins
    systemctl start jenkins
    systemctl enable jenkins
    
    # Get Jenkins initial admin password
    echo "Jenkins initial admin password:"
    cat /var/lib/jenkins/secrets/initialAdminPassword
    
    # Install kubectl
    echo "Installing kubectl..."
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    chmod +x kubectl
    mv kubectl /usr/local/bin/
    
    # Install Minikube
    echo "Installing Minikube..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    chmod +x minikube-linux-amd64
    mv minikube-linux-amd64 /usr/local/bin/minikube
    
    # Install Helm
    echo "Installing Helm..."
    curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
    apt-get update
    apt-get install -y helm
    
    # Configure firewall
    echo "Configuring firewall..."
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw allow 3001/tcp
    ufw allow 8080/tcp
    ufw allow 27017/tcp
    ufw allow 6379/tcp
    ufw --force enable
    
    # Create application directories
    echo "Creating application directories..."
    mkdir -p /opt/farm-management/{backend,frontend,logs,scripts,tests}
    mkdir -p /opt/farm-management/backup
    mkdir -p /opt/farm-management/monitoring
    
    # Set proper permissions
    chown -R vagrant:vagrant /opt/farm-management
    
    echo "Basic provisioning completed!"
  SHELL
end
