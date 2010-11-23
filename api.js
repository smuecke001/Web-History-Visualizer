// A visit object represents one visit to a page. It has the properties: 
//   id: string,
//   url: string,
//   title: string,
//   time: int, milliseconds since epoch
//   refId: string, id of another visit object
//   transition: one of ["link", "typed", "auto_bookmark", "auto_subframe", "manual_subframe", "generated", "start_page", "form_submit", "reload", "keyword", "keyword_generated"]

// Pass one of these properties in to any function that asks for a timeScale
// e.g. someFunction(TimeScale.DAY)
var TimeScale = {
    HOUR: 1,  // 0 - 23
    DAY: 2,   // 1 - 31
    MONTH: 3, // 0 - 11
    YEAR: 4   // 1970 - 
}

// Returns all visits that match the optional `filter'.
// A filter object can have any of the following properties:
//   maxTime: int
//   minTime: int
//   domain: string
//   url: string (not implemented)
//   category: string (not implemented)
//   visitId: string (not implemented)
function getVisits(filter) {
    filter = filter || {}
    var filteredVisits = [];

    for (var i in _visits) {
        var visit = _visits[i];
        var domain = parseUri(visit.url).host;
        if (filter.domain && domain !== filter.domain) {
            continue;
        }
        if (filter.minTime && visit.time < filter.minTime) {
            continue;
        }
        if (filter.maxTime && visit.time > filter.maxTime) {
            continue;
        }
        filteredVisits.push(visit);
   }
   return filteredVisits;
}

// Returs a hash in the form of {2009: 3, 2010: 5, ...}, showing the number
// of visits in each time period
function numVisitsByTime(visits, timeScale) {
    var func = getTimeScaleFunc(timeScale);

    var numVisits = {};
    for (var i in visits) {
        var time = new Date(visits[i].time)[func]();
        numVisits[time] = numVisits[time] || 0;
        numVisits[time]++;
    }
    return numVisits;
}


// Returs a hash in the form of {"google.com", 5, "cnn.com": 3, ...}, showing
// the number of visits to each domain
function numVisitsByURL(visits) {
    var numVisits = {};
    for (var i in visits) {
        var domain = parseUri(visits[i].url).host;
        numVisits[domain] = numVisits[domain] || 0;
        numVisits[domain]++;
    }
    return numVisits;
}

// Converts a hash into an array of the form: 
// [{key: ..., val: ...}, ...]
// The array will be sorted by key unless the optional `sortByValue` is true,
// in which case it will be sorted by value
function hashToArray(hash, sortByValue) {
    var arr = [];
    for (var i in hash) {
        arr.push({
            key: i,
            val: hash[i]
        });
    }
    sortBy(arr, sortByValue ? "val" : "key");
    return arr;
}
