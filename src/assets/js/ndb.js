// A Javascript interface to the FDA's NDB
export {search_foods};

var ndb_base_url = 'https://api.nal.usda.gov/ndb/';

var ndb_key = 'hcr1JOtAJOEfS9DWFZTriTXao8v4ILL0RmNNAvSE';


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

function create_uri(ndb_func, query) {
	var defaults = {
		'format': 'json',
		'api_key': ndb_key
	};

	var query_str = query_dict_to_str(query) + '&' + query_dict_to_str(defaults);

	var query_uri = ndb_base_url + ndb_func + '?' + query_str;

	return query_uri;
}

function ndb_query(ndb_func, query, callback) {
	var query_uri = create_uri(ndb_func, query);
	// console.log("query URI: " + query_uri);

	// const result_obj = await fetch(query_uri);
	// const result = await result_obj.json();

	// console.log(result);

	// return result;

	fetch(query_uri)
		.then(function(response) {
			return response.json();
		})
		.then(function(resp_json) {
			// console.log(resp_json);
			callback(resp_json);
		})
}


function search_foods(search_str, callback) {
	// console.log('searching for ' + search_str);
	ndb_query('search', {
		'q': search_str,
		'sort': 'n',
		'max': 100,
		'offset': 0 
	}, callback);
}

/*

async function ndb_query(ndb_func, query) {
	var query_uri = create_uri(ndb_func, query);
	// console.log("query URI: " + query_uri);

	const result_obj = await fetch(query_uri);
	const result = await result_obj.json();

	// console.log(result);

	return result;
}

exports.query = async (ndb_func, query) => ndb_query;

exports.search_foods = async (search_str) => {
	// console.log('searching for ' + search_str);
	const result = await ndb_query('search', {
		'q': search_str,
		'sort': 'n',
		'max': 1000,
		'offset': 0 
	});

	return result;
};

exports.get_foods = async (ndbno_list) => {
	const result = await ndb_query('V2/reports', {
		'ndbno': ndbno_list,
		'type': 'f'
	});

	return result;
};
*/
