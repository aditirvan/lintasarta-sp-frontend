const path = require('path');

it('should upload a file', function () {
    browser.url('https://the-internet.herokuapp.com/upload')

    const filePath = '/home/ubuntu/vue-test/test/specs/manageos/test.iso'
    const remoteFilePath = browser.uploadFile(filePath)

    $('#file-upload').setValue(remoteFilePath)
    $('#file-submit').click()
});