

class EsWrapper(object):

    def __init__(self, index, doc_type):
        try:
            from elasticsearch import Elasticsearch
        except ImportError:
            from sys import exit
            print "Elasticsearch official Python client driver 'elasticsearch' required"
            exit()

        self.index = index
        self.doc_type = doc_type
        self.es = Elasticsearch()
        self.results = None
        self.query = None

    def create_simple_query(self, input_object):

        if isinstance(input_object, list) and isinstance(input_object[0], dict):
            match = [{"match": elem} for elem in input_object]

            query = dict(
                query=dict(
                    bool=dict(
                        should=match
                    )
                )
            )
        elif isinstance(input_object, dict):
            query = dict(
                query=dict(
                    bool=dict(
                        should=dict(
                            match=input_object
                        )
                    )
                )
            )
        else:
            print "Invalid input type: %s" % type(input_object)
            return

        self.query = query
        return self

    def search(self, body=None, size=10):

        if self.query:
            query = self.query
        else:
            query = body

        self.results = self.es.search(
            index=self.index,
            doc_type=self.doc_type,
            body=query,
            size=size
        )
        return self

    def get(self, _id):

        self.results = self.es.search(
            index=self.index,
            doc_type=self.doc_type,
            id=_id
        )
        return self

    def parse_to_document(self, search_results=None):

            if self.results:
                returned_search_object = self.results
            else:
                returned_search_object = search_results

            # print type(returned_search_object)

            parse1 = returned_search_object['hits']['hits']
            parse2 = [
                elem
                for elem
                in parse1
            ]

            return parse2

    def parse_to_source(self, search_results=None):

        if self.results:
            returned_search_object = self.results
        else:
            returned_search_object = search_results

        # print type(returned_search_object)

        parse1 = returned_search_object['hits']['hits']
        parse2 = [
            elem['_source']
            for elem
            in parse1
        ]

        return parse2

    @staticmethod
    def list_indices(url='http://localhost:9200/_cat/indices?v'):
        import requests

        derp = requests.get(url).text
        data = [
            [elem
             for elem
             in derp.split("\n")[i].split(" ")
             if elem != ""]
            for i in range(0, len(derp.split("\n")))
        ]

        output = [dict(zip(data[0], data[i])) for i in range(1, len(data) - 1)]
        return output
