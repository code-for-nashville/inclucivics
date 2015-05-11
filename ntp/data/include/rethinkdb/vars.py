from ..sanitize.vars import NAME, DEMOGRAPHIC

INCLUCIVICS_DB = "inclucivics"
PARSED_DB = "parsed"
RAW_DB = "raw"

TEMPORAL_DATA = "chi_raw"
CHI_GRAPHS = "chi_merged"

TABLES = [
    TEMPORAL_DATA,
    CHI_GRAPHS
]

#IMPORT_STRING = "%s.%s" % (INCLUCIVICS_DB, TABLE_RAW)
IMPORT_PATH = "files/input/"
