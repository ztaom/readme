/**  
* a lib to analysis url
* ?a=1&b=2   => {a: 1, b: 2}
**/
export default function () {
    let url = location.search.replace('?', ''),
        params = {};
    url = url.split('&');
    url.forEach((i, j) => {
        let arr = i.split('=');
        params[arr[0]] = arr[1]
    })
    return params;
};
