// This file provides a Javascript interface to the USDA's NDB.

// NDB is a database of many foods and their nutrient content.

// This interface allows an application to search for foods in NDB
// and get a complete list of nutrients in each food.

export {search_foods, load_all_nutrients, Food};

// The URL of NDB
let ndb_base_url = 'https://api.nal.usda.gov/ndb/';

// NDB key to use in URIs
let ndb_key = 'hcr1JOtAJOEfS9DWFZTriTXao8v4ILL0RmNNAvSE';

// Convert a dictionary of query options into a URI
// variable string
function query_dict_to_str(query) {
    let query_args = [];

    for (let key in query) {
        let val = query[key];

        if (Array.isArray(val)) {
            for (let val_ind in val) {
                let arg_str = String(key) + '=' + String(val[val_ind]);
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
    let defaults = {
        'format': 'json',
        'api_key': ndb_key
    };

    let query_str = query_dict_to_str(query) + '&' + query_dict_to_str(defaults);

    let query_uri = ndb_base_url + ndb_func + '?' + query_str;

    return query_uri;
}

// Look query the database
function ndb_query(ndb_func, query, callback) {
    let query_uri = create_uri(ndb_func, query);

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
        let nutrients_json = []

        if (resp_json.hasOwnProperty('foods')) {
            let foods_json = resp_json['foods']
            if (foods_json.length > 0) {
                if (foods_json[0].hasOwnProperty('food')) {
                    let food_json = foods_json[0]['food']

                    if (food_json.hasOwnProperty('nutrients')) {
                        nutrients_json = food_json['nutrients']
                    }
                }
            }
        }

        callback(nutrients_json)
    })
}

const nutrient_props_needed = [
    // 'measures',
    'name',
    'nutrient_id',
    'unit',
    'value'
]

class Nutrient {
    constructor(nutrient_json) {
        for (let prop_ind in nutrient_props_needed) {
            let prop = nutrient_props_needed[prop_ind]
            if (nutrient_json.hasOwnProperty(prop)) {
                this[prop] = nutrient_json[prop]
            }
        }
    }
}

const food_props_needed = [
    'has_max_servings',
    'name',
    'ndbno',
    'nutrients',
    'nutrients_loaded',
    'serving_amount',
    'serving_unit',
    'servings_range'
]

class Food {
    constructor(food_json) {
        for (let prop_ind in food_props_needed) {
            let prop = food_props_needed[prop_ind]
            if (food_json.hasOwnProperty(prop)) {
                this[prop] = food_json[prop]
            }
        }

        // If nutrients have not been loaded, don't load
        // them, but set up the nutrients object
        if (!this.nutrients_loaded) {
            this.nutrients = {}
        }

        // Add variables to let user set min and max
        // amounts they are willing to eat
        if (!this.servings_range) {
            this.servings_range = [0, 0]
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
                    for (let ind = 0; ind < nutrients_json.length; ind++) {
                        // this.nutrients.push()
                        let id = nutrients_json[ind].nutrient_id.toString()
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
        'offset': 0,
        'ds': 'Standard Reference'
    }, function(resp_json) {
        let foods = []
        if (resp_json.hasOwnProperty('list')) {
            let resp_list = resp_json.list

            if (resp_list.hasOwnProperty('item')) {
                let foods_json = resp_list.item

                for (let ind = 0; ind < foods_json.length; ind++) {
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
