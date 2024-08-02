let rp = '/public/libs/'
let cdn = {
    cdn_path: rp,
    website: {
        styles: [
            rp + 'bootstrap5/css/bootstrap.css',
            rp + 'Notyf/notyf.min.css',
            rp + 'fontawesome-free/css/all.min.css',

        ],
        scripts: [
            rp + 'jquery/jquery.min.js',
            rp + 'bootstrap5/js/bootstrap.js',
            rp + 'Notyf/notyf.min.js',
        ]
    },
}

module.exports = cdn;
