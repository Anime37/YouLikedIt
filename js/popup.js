const options = ['simple', 'playlist', 'queue', 'mymix'];

function saveOptions() {
    let state = {};
    options.forEach(opt => {
        state[opt] = document.getElementById(opt).checked;
    });
    browser.storage.sync.set(state);
}

function loadOptions() {
    browser.storage.sync.get(options, (result) => {
        options.forEach(opt => {
            document.getElementById(opt).checked = result[opt] || false;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadOptions();
    console.log(options);

    options.forEach(opt => {
        document.getElementById(opt).addEventListener('change', saveOptions);
    });
});
