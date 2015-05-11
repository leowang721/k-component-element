define('k-component/config', ['require'], function (require) {
    var config = {
            LOADER_FILE_SUFFIX: 'component.html',
            REGISTER_TAG: 'k-component',
            CACHED_ACTION_KEY: '$$_COMPONENT_ACTION_$$'
        };
    return config;
});