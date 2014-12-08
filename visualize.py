# from vincent import AxisProperties, PropertySet, ValueRef
import pandas as pd

data = pd.read_excel("bin/input/data.xls", sheet="Detail")
ethnic = data.groupby(["Description", "Gender"])
