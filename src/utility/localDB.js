function ls_set(name, value){
    localStorage.setItem(name, JSON.stringify({
        data: value
    }));
}

function ls_get(name){

    let raw = localStorage.getItem(name);

    if (raw){
        return JSON.parse(raw)?.data;
    } else {
        return null;
    }
}

export { ls_set, ls_get };