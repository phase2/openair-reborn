# OpenAir Reborn!

A Chrome extension that converts OpenAir's clicky clicky time tracking grid into
a nice, keyboard-powered, Toggl-esque interface.

### Installation

Download it from the Chrome Webstore. (Link coming soon!)

### How to contribute

**Step 1: Download and install dependencies**

1. Fork this repo and clone your fork locally.
2. Open up the root directory in a terminal
3. Run `npm install` to install the node dependencies, such as grunt and bower
4. Run `bower install` to install the bower components
5. Run `bower install` again in `test/` to install the testing bower components

**Step 2: Install from source**

1. Disable the Webstore version of the extension if you have it enabled.
2. Open up [chrome://extensions](chrome://extensions) and click "Developer mode".
3. Click "Load unpacked extension" and browse to the `app/` directory to install it.
4. The extension should be running now. Reload an OpenAir timesheet to confirm.

**Step 3: Start developing**

1. Run `grunt debug` and confirm that you see something [like this](http://note.io/1rgHkvn).
2. Edit some code. The extension itself should reload automatically (thanks Yeoman!),
   and CSS changes should be applied automatically, but you still have to reload
   the OpenAir tab to make it pick up any JS changes.
3. When you're done with your changes, push them to your fork and create a pull request for them.
4. You can also run `grunt build` at any time to bump the manifest version and generate a Webstore compatible zip file for upload.
