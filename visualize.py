import vincent
from vincent import AxisProperties, PropertySet, ValueRef
import pandas as pd

DATA = pd.read_excel("bin/input/data.xls", sheet="Detail")

# Description is the ethnicity according to this dataset
ETHNICITY = data.groupby(["Description"])

ETHNICITY_BY_SALARY = vincent\
    .Bar(
        ETHNICITY
        .mean()
        .sort(
            "Annual Salary",
            ascending=False
        )['Annual Salary'])

ETHNICITY_BY_SALARY\
    .axes[0]\
    .properties = AxisProperties(
         labels=PropertySet(
             angle=ValueRef(value=45),
             align=ValueRef(value="left")
                )
        )