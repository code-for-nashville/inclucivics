FROM python:2.7.13-slim

ENV INCLUCIVICS="/srv/inclucivics"
ADD . ${INCLUCIVICS}

RUN pip install -e ${INCLUCIVICS}

WORKDIR ${INCLUCIVICS}

CMD ["bash"]
