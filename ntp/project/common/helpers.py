from copy import deepcopy
from operator import methodcaller

def unique_list(list_obj):
    """
    convenience function for getting a list of all unique values.
    :param list_obj:
    :return: list_obj with unique values.
    """
    return list(set(list_obj))


def reduceTuple(key_value_tuple_list):
    output = {}
    for elem in key_value_tuple_list:
        if elem[0] in output.keys():
            output[elem[0]] += elem[1]
        else:
            output[elem[0]] = elem[1]
    return output


def chunk(listObject, chunks=4):
    
    length = len(listObject)
    chunks = chunks
    
    # Handle all numbers by finding the remainder
    remainder = length % chunks
        
    # Create a numerator that will always be divisible by the number of chunks
    properNumerator = length - remainder
    
    # Create the basic chunkIndex for slicing the list.
    chunkIndex = properNumerator/chunks
    
    # Create each slice boundary
    index = [chunkIndex * i for i in range(1,chunks)]
    # Handle the final slice boundary and remainder
    index.append(properNumerator+remainder)
    
    # Insert the origin index
    index.insert(0,0)

    # I know this is ugly.  But we are slicing through the index range to get each evenly divided chunk.
    output = [listObject[index[i]:index[i+1]] for i in range(0,len(index)) if index[i]!=index[-1]]
    
    return output


def sortDict(dictionary, val, reverse=False):
    dictionary = sorted(dictionary, key=lambda k: k[val], reverse=reverse)
    return dictionary


def unpack(list_of_lists):
    output = [inner for outer in list_of_lists for inner in outer]
    return output


def unpackCount(list_object, key):
    from collections import Counter
    
    if type(list_object) == list and type(list_object[0])==dict and type(list_object[0][key])==list:
        temp = [elem[key] for elem in list_object]
        temp = [inner for outer in temp for inner in outer]
        return Counter(temp)
    else:
        return "Input object needs to be a list of dictionaries all containing the same key.  The value must be either a list of str/unicode"


def filter_str(string, replace="", method="isalnum"):
    """
    :param string: string to be filtered
    :param replace: value to replace with, defaults to empty
    :param method: Valid filter_methods: "isalpha", "isalnum", "isdigit"
    :return: filtered string.
    """
    return "".join([char if methodcaller(method)(char) else replace for char in string])


def concat_values(original, new, uniq=False, skip_fields=[], to_string=False):
    """
    Takes two dictionaries with like keys and concatenates the values into a list
    Params uniq, skip_fields, and to_string can modify the fundamental behavior to prune redundant values.

    :param original: dict obj to add to
    :param new: dict object to concat
    :param uniq: Boolean whether or not concatenated values should be unique
    :param skip_fields: list/tuple, fields to skip making unique
    :param to_string: Boolean, whether or not to remove list wrapping when len(list_val)==1
    :return:
    """

    recipient = deepcopy(original)
    donor = deepcopy(new)

    for key in recipient:
        if not isinstance(recipient[key], list):
            recipient[key] = [recipient[key]]

        if key in donor and not isinstance(donor[key], list):
             recipient[key].append(donor[key])

        if key in donor and isinstance(donor[key], list):
            recipient[key] += donor[key]

    if uniq:
        recipient = {key: unique_list(recipient[key]) if key not in skip_fields else recipient[key] for key in recipient}

    # No worry of this failing because the value is always a list
    if to_string:
        recipient = {
            key: recipient[key][0]
            if len(recipient[key]) == 1 and key not in skip_fields
            else recipient[key] for key in recipient
        }

    return recipient


def merge_json_like(json_like, uniq=False, to_string=False):
    """
    Takes a list of dictionary objects and compresses it into a single dictionary while concatenating each value into a list
    This is effectively a reduce() function, but done in imperatively... because it's actually faster this way in python...
    :param json_like:
    :return: dictionary with each repeated value a list of all previous values.
    """

    merged = {}
    for item in json_like:
        if not merged:
            merged = item
            continue
        merged = concat_values(merged, item, uniq=uniq, to_string=to_string)
    return merged
