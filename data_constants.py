"""Data Structure for creating Summary object.

This is used to create summary.json
"""
LOW = 'Lower Income Range (Less than $33,000)'
MID = 'Middle Income Range ($33,000 and $66,000)'
HIGH = 'Upper Income Range (Greater than $66,000)'
UNKNOWN_INCOME = 'Unknown Income'
SUMMARY_STRUCTURE = [
    {
        "series": [
            {"data": [], "name": "American Indian/Alaskan Native"},
            {"data": [], "name": "Asian or Pacific Islander"},
            {"data": [], "name": "Black"},
            {"data": [], "name": "Hawaiian or Pacific Islander"},
            {"data": [], "name": "Hispanic"},
            {"data": [], "name": "Two or More Races"},
            {"data": [], "name": "Unknown"},
            {"data": [], "name": "White (Not of Hispanic Origin)"}
        ],
        "time": [],
        "title": "Metro Overall",
    }, {
        "series": [
            {"data": [], "date": [], "name": "American Indian/Alaskan Native"},
            {"data": [], "date": [], "name": "Asian or Pacific Islander"},
            {"data": [], "date": [], "name": "Black"},
            {"data": [], "date": [], "name": "Hawaiian or Pacific Islander"},
            {"data": [], "date": [], "name": "Hispanic"},
            {"data": [], "date": [], "name": "Two or More Races"},
            {"data": [], "date": [], "name": "Unk nown"},
            {"data": [], "date": [], "name": "White (Not of Hispanic Origin)"}
        ],
        "time": [],
        "title": LOW
    }, {
        "series": [
            {"data": [], "date": [], "name": "American Indian/Alaskan Native"},
            {"data": [], "date": [], "name": "Asian or Pacific Islander"},
            {"data": [], "date": [], "name": "Black"},
            {"data": [], "date": [], "name": "Hawaiian or Pacific Islander"},
            {"data": [], "date": [], "name": "Hispanic"},
            {"data": [], "date": [], "name": "Two or More Races"},
            {"data": [], "date": [], "name": "Unknown"},
            {"data": [], "date": [], "name": "White (Not of Hispanic Origin)"}
        ],
        "time": [],
        "title": MID
    }, {
        "series": [
            {"data": [], "date": [], "name": "American Indian/Alaskan Native"},
            {"data": [], "date": [], "name": "Asian or Pacific Islander"},
            {"data": [], "date": [], "name": "Black"},
            {"data": [], "date": [], "name": "Hawaiian or Pacific Islander"},
            {"data": [], "date": [], "name": "Hispanic"},
            {"data": [], "date": [], "name": "Two or More Races"},
            {"data": [], "date": [], "name": "Unknown"},
            {"data": [], "date": [], "name": "White (Not of Hispanic Origin)"}
        ],
        "time": [],
        "title": HIGH
    }
]
