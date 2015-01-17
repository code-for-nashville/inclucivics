install.packages("Rcmdr", dependencies=TRUE)
# Install Bioconductor
source("http://bioconductor.org/biocLite.R")
biocLite()

# Install R-packages
install.packages("ggplot2")
install.packages("Hmisc")
install.packages("gap")
install.packages("matlab")
install.packages("lattice")
install.packages("jsonlite")
install.packages("rjson")

  #Update R packages
  update.packages(ask=FALSE)

# Update installed Bioconductor packages
source("http://bioconductor.org/biocLite.R")
update.packages(repos=biocinstallRepos(), ask=FALSE)