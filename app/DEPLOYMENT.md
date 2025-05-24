# Deployment Guide for StocksBrew Server

## Prerequisites
- EC2 instance running Ubuntu
- stockbrew.pem file in the app directory
- Python 3.8 or higher installed on EC2

## Deployment Steps

1. First, SSH into your EC2 instance (replace YOUR_EC2_IP with your instance's public IP):
```bash
chmod 400 stockbrew.pem
ssh -i stockbrew.pem ubuntu@YOUR_EC2_IP
```

2. Install system dependencies:
```bash
sudo apt-get update
sudo apt-get install -y python3-pip python3-venv nginx
```

3. Create and navigate to the application directory:
```bash
sudo mkdir -p /var/www/stocksbrew
sudo chown ubuntu:ubuntu /var/www/stocksbrew
cd /var/www/stocksbrew
```

4. Copy the application files to EC2 (run this from your local machine):
```bash
cd /path/to/your/app
scp -i stockbrew.pem -r * ubuntu@YOUR_EC2_IP:/var/www/stocksbrew/
```

5. Set up Python virtual environment and install dependencies:
```bash
cd /var/www/stocksbrew
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

6. Create systemd service file (run as sudo):
```bash
sudo nano /etc/systemd/system/stocksbrew.service
```

Add the following content:
```ini
[Unit]
Description=StocksBrew Flask Application
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/stocksbrew
Environment="PATH=/var/www/stocksbrew/venv/bin"
ExecStart=/var/www/stocksbrew/venv/bin/gunicorn --workers 3 --bind 0.0.0.0:5000 wsgi:app

[Install]
WantedBy=multi-user.target
```

7. Configure Nginx (run as sudo):
```bash
sudo nano /etc/nginx/sites-available/stocksbrew
```

Add the following content:
```nginx
server {
    listen 80;
    server_name YOUR_EC2_IP;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

8. Enable the Nginx configuration:
```bash
sudo ln -s /etc/nginx/sites-available/stocksbrew /etc/nginx/sites-enabled
sudo nginx -t
sudo systemctl restart nginx
```

9. Start and enable the StocksBrew service:
```bash
sudo systemctl start stocksbrew
sudo systemctl enable stocksbrew
```

10. Check the service status:
```bash
sudo systemctl status stocksbrew
```

## Troubleshooting

- View application logs:
```bash
sudo journalctl -u stocksbrew -f
```

- Check Nginx logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

## Important Notes

1. Make sure your EC2 security group allows:
   - SSH (port 22)
   - HTTP (port 80)
   - HTTPS (port 443) if you plan to add SSL
   - Application port (5000) if you want direct access

2. Set up your environment variables:
   - Copy your .env file to /var/www/stocksbrew/
   - Make sure the service has access to it

3. The application will be accessible at:
   http://YOUR_EC2_IP/

4. For production, it's recommended to:
   - Set up SSL/HTTPS
   - Use a domain name
   - Configure proper security measures
   - Set up monitoring 