// A Javascript interface to the FDA's NDB
export {search_foods, load_all_nutrients, Food};

// The URL of NDB
var ndb_base_url = 'https://api.nal.usda.gov/ndb/';

// NDB key to use in URIs
var ndb_key = 'hcr1JOtAJOEfS9DWFZTriTXao8v4ILL0RmNNAvSE';

// Convert a dictionary of query options into a URI
// variable string
function query_dict_to_str(query) {
    var query_args = [];

    for (var key in query) {
        var val = query[key];

        if (Array.isArray(val)) {
            for (var val_ind in val) {
                var arg_str = String(key) + '=' + String(val[val_ind]);
                query_args.push(arg_str);
            }

        } else {
            let arg_str = String(key) + '=' + String(val);
            query_args.push(arg_str);
        }
    }

    return query_args.join('&');
}

// Create an NDB query URI
function create_uri(ndb_func, query) {
    var defaults = {
        'format': 'json',
        'api_key': ndb_key
    };

    var query_str = query_dict_to_str(query) + '&' + query_dict_to_str(defaults);

    var query_uri = ndb_base_url + ndb_func + '?' + query_str;

    return query_uri;
}

// Look query the database
function ndb_query(ndb_func, query, callback) {
    var query_uri = create_uri(ndb_func, query);

    fetch(query_uri)
        .then(function(response) {
            return response.json();
        })
        .then(function(resp_json) {
            callback(resp_json);
        })
}

// Load the nutrition info for a food
function load_food_nutrients(ndbno, callback) {
    ndb_query('V2/reports', {
        'ndbno': ndbno,
        'type': 'f'
    }, function(resp_json) {
        var nutrients_json = []
        // console.log(JSON.parse(JSON.stringify(resp_json)))

        if (resp_json.hasOwnProperty('foods')) {
            var foods_json = resp_json['foods']
            if (foods_json.length > 0) {
                if (foods_json[0].hasOwnProperty('food')) {
                    var food_json = foods_json[0]['food']

                    if (food_json.hasOwnProperty('nutrients')) {
                        nutrients_json = food_json['nutrients']
                    }
                }
            }
        }

        callback(nutrients_json)
    })
}

class Nutrient {
    constructor(nutrient_json) {
        for (var prop in nutrient_json) {
            this[prop] = nutrient_json[prop]
        }
    }
}


class Food {
    constructor(food_json) {
        for (var prop in food_json) {
            this[prop] = food_json[prop]
        }

        // If nutrients have not been loaded, don't load
        // them, but set up the nutrients object
        if (!this.nutrients_loaded) {
            this.nutrients = {}
        }

        // Add variables to let user set min and max
        // amounts they are willing to eat
        if (!this.servings_range) {
            this.min_servings = 0
            this.max_servings = 0
            this.servings_range = [0.0, 0.0]
            this.has_max_servings = false
        }
    }

    // Load nutrients only if they haven't been loaded yet,
    // then call a callback if one was given
    load_nutrients(callback) {
        if (!this.nutrients_loaded) {
            load_food_nutrients(
                this.ndbno,
                (nutrients_json) => {
                    for (var ind = 0; ind < nutrients_json.length; ind++) {
                        // this.nutrients.push()
                        var id = nutrients_json[ind].nutrient_id.toString()
                        this.nutrients[id] = new Nutrient(nutrients_json[ind])
                        this.nutrients_loaded = true
                    }

                    // All NDB nutrient values are per 100g of the food
                    this.serving_amount = 100
                    this.serving_unit = 'g'

                    if (callback) {
                        callback(this.nutrients)
                    }
                }
            )

        } else if (callback) {
            callback(this.nutrients)
        }
    }
}

// Search for a food by best matching string
function search_foods(search_str, callback) {
    ndb_query('search', {
        'q': search_str,
        'sort': 'r',
        'max': 100,
        'offset': 0 
    }, function(resp_json) {
        var foods = []
        if (resp_json.hasOwnProperty('list')) {
            var resp_list = resp_json.list

            if (resp_list.hasOwnProperty('item')) {
                var foods_json = resp_list.item

                for (var ind = 0; ind < foods_json.length; ind++) {
                    foods.push(new Food(foods_json[ind]))
                }
            }
        }

        callback(foods)
    })
}


function load_all_nutrients(callback) {
    ndb_query('list', {
        'lt': 'n',
        'sort': 'n',
        'max': 1000
    }, callback)
}