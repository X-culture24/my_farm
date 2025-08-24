# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Use Ubuntu 20.04 LTS (Focal) as base image
  config.vm.box = "ubuntu/focal64"
  # Removed specific version constraint to use latest available
  # config.vm.box_check_update = true  # Enabled by default
  
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
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -y
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
      python3-venv
    
    # Install Docker
    echo "Installing Docker..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu focal stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io
    
    # Install Node.js 20.x (LTS)
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    
    # Install Yarn (modern version)
    echo "Installing Yarn..."
    corepack enable
    npm install -g yarn@latest
    
    # Install PM2 globally
    echo "Installing PM2..."
    npm install -g pm2@latest
    
    # Install pnpm for faster package management
    echo "Installing pnpm..."
    npm install -g pnpm@latest
    
    # Install Docker Compose
    echo "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    
    # Install MongoDB 7.0
    echo "Installing MongoDB 7.0..."
    curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    apt-get update
    apt-get install -y mongodb-org mongodb-mongosh mongodb-database-tools
    
    # Install Redis
    echo "Installing Redis..."
    apt-get install -y redis-server
    
    # Install Nginx
    echo "Installing Nginx..."
    apt-get install -y nginx
    
    # Install Jenkins
    echo "Installing Jenkins..."
    curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | gpg --dearmor -o /usr/share/keyrings/jenkins.gpg
    echo "deb [signed-by=/usr/share/keyrings/jenkins.gpg] https://pkg.jenkins.io/debian-stable binary/" | tee /etc/apt/sources.list.d/jenkins.list > /dev/null
    apt-get update
    apt-get install -y jenkins
    
    # Install kubectl
    echo "Installing kubectl..."
    curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
    install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
    
    # Install Minikube
    echo "Installing Minikube..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    install -o root -g root -m 0755 minikube-linux-amd64 /usr/local/bin/minikube
    
    # Install Helm
    echo "Installing Helm..."
    curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | tee /usr/share/keyrings/helm.gpg > /dev/null
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | tee /etc/apt/sources.list.d/helm-stable-debian.list
    apt-get update
    apt-get install -y helm
    
    # Configure firewall
    echo "Configuring firewall..."
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw allow 3000/tcp
    ufw allow 3001/tcp
    ufw allow 8080/tcp
    ufw allow 27017/tcp
    ufw allow 6379/tcp
    ufw --force enable
    
    # Start and enable services
    systemctl enable --now docker
    systemctl enable --now redis-server
    systemctl enable --now mongod
    systemctl enable --now jenkins
    
    # Add vagrant user to docker group
    usermod -aG docker vagrant
    
    # Install additional DevOps tools
    echo "Installing additional DevOps tools..."
    
    # Install Terraform
    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com focal main" | tee /etc/apt/sources.list.d/hashicorp.list
    apt-get update && apt-get install -y terraform
    
    # Install Ansible
    apt-get install -y ansible
    
    # Install SonarQube Scanner
    wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.8.0.2856-linux.zip
    unzip sonar-scanner-cli-4.8.0.2856-linux.zip -d /opt/
    ln -s /opt/sonar-scanner-4.8.0.2856-linux/bin/sonar-scanner /usr/local/bin/sonar-scanner
    rm sonar-scanner-cli-4.8.0.2856-linux.zip
    
    # Create application directories
    echo "Creating application directories..."
    mkdir -p /opt/farm-management/{backend,frontend,logs,scripts,tests,monitoring,backup}
    mkdir -p /opt/farm-management/k8s/{staging,production}
    mkdir -p /opt/farm-management/helm
    mkdir -p /var/log/farm-management
    
    # Set proper permissions
    chown -R vagrant:vagrant /opt/farm-management
    chown -R vagrant:vagrant /var/log/farm-management
    
    # Setup development environment
    echo "Setting up development environment..."
    
    # Create useful aliases
    cat >> /home/vagrant/.bashrc << 'EOF'

# Farm Management System aliases
alias fm-logs='tail -f /var/log/farm-management/*.log'
alias fm-start='cd /vagrant && npm run dev'
alias fm-test='cd /vagrant && npm test'
alias fm-build='cd /vagrant && npm run build'
alias fm-docker='cd /vagrant && docker-compose up -d'
alias k='kubectl'
alias h='helm'

# Git aliases
alias gs='git status'
alias ga='git add'
alias gc='git commit'
alias gp='git push'
alias gl='git log --oneline'

EOF
    
    # Get Jenkins initial admin password
    echo "==================================="
    echo "Jenkins initial admin password:"
    cat /var/lib/jenkins/secrets/initialAdminPassword 2>/dev/null || echo "Jenkins not yet initialized"
    echo "==================================="
    echo "Access URLs:"
    echo "Jenkins: http://192.168.56.10:8080"
    echo "Application: http://192.168.56.10:3000"
    echo "MongoDB: mongodb://192.168.56.10:27017"
    echo "Redis: redis://192.168.56.10:6379"
    echo "==================================="
    
    echo "✅ Farm Management Development Environment Ready!"
  SHELL
end