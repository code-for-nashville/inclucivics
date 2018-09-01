const LOW = 0
const MID = 1
const HIGH = 2
const SALARY_BUCKETS = [HIGH, MID, LOW]
const SALARY_BUCKET_LABELS = {
  [LOW]: 'Lower Income Range (Less than $33,000)',
  [MID]: 'Middle Income Range ($33,000 and $66,000)',
  [HIGH]: 'Upper Income Range (Greater than $66,000)'
}
const S3_URL = '/test'

const ETHNICITY_ATTRIBUTE = 'ethnicity'
const ETHNICITY_IDS = [
  30,
  31,
  99,
  2,
  1,
  3,
  4,
  5
]
const ETHNICITY_ID_LABELS = {
  30: 'Hawaiian or Pacific Islander',
  31: 'Two or More Races',
  99: 'Unknown',
  2: 'Black',
  1: 'White (Not of Hispanic Origin)',
  3: 'Hispanic',
  4: 'Asian or Pacific Islander',
  5: 'American Indian/Alaskan Native'
}
const ETHNICITY_LABELS = Object.values(ETHNICITY_ID_LABELS)

const GENDER_ATTRIBUTE = 'gender'
const GENDERS = ['M', 'F']

const ATTRIBUTE_TO_CHOICES = {
  [ETHNICITY_ATTRIBUTE]: ETHNICITY_LABELS,
  [GENDER_ATTRIBUTE]: GENDERS
}

module.exports = {
  LOW,
  MID,
  HIGH,
  SALARY_BUCKETS,
  SALARY_BUCKET_LABELS,
  ETHNICITY_ATTRIBUTE,
  ETHNICITY_IDS,
  ETHNICITY_ID_LABELS,
  ETHNICITY_LABELS,
  GENDER_ATTRIBUTE,
  GENDERS,
  ATTRIBUTE_TO_CHOICES,
  S3_URL
}
