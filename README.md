INCLUCIVICS
==========

INCLUVICS is a data visualization app done in partnership with the Human Relations Commission.  The goal is to provide
transparency into employee demographics at Nashville's Metro Government

### Development Requirements:
* Vagrant >= 1.5.1
* Ansible >= 1.7.2
* VirtualBox >= 4.3.18

### Setup:
1. For AWS deployment provide a set of environmental variables with these values

- AWS_ACCESS_ID
- AWS_SECRET_KEY
- SSH_KEY_PAIR - Path to SSH_KEY_PAIR created through AWS ec2
- KEY_PAIR_NAME
- AMI - The specific AMI id
- INSTANCE - Instance type, (i.e "t1.micro" or "m3.large")
- REGION - Availability region of AWS account
- SECURITY - Security group in AWS.  You have to create one with SSH open.
- SSH_USER

#####Be careful to avoid committing these.  I intentionally omitted a sourcing script to encourage caution.
 
2. Run:
 
    For local development:
    `vagrant up`
    This defaults to Ubuntu lts 14.04.
    
    `vagrant up --provider=aws` 
    This will launch the EC2 instance.
    
    Both VM's will install whatever is defined in .ansible/playbook.yml, however because these are not exactly the same there is
    the potential for some variation between local development and cloud deployment.
