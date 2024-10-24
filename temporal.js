
function KAppIcon(title, drawerCallback = KDefaultImages("TERMINAL"), clickEventListener = null) {
    let frame = KLayer(
        /*
        KCanvas()
            .setSize(64, 64)
            .setReferenceSize(64, 64)
            .setValue(drawerCallback)
            .addCssText("display: block; position: relative; left:32px; top: 4px;"),
            */
        KImage()
            .setSize(64, 64)
            //.setReferenceSize(64, 64)
            .setValue(drawerCallback())
            .addCssText("display: block; position: relative; left:32px; top: 4px;"),
        KLabel()
            .setValue(title)
            .addCssText("display: block; position: relative; margin-left:4px; margin-right:4px; margin-top:8px; text-align: center; line-height: 16px;  background-color: white;"),
    )
        .addCssText("display: inline-block; position: relative;  width: 128px; height: 128px; border: 1px solid black; border-radius: 8px; margin: 8px; padding: 0px; box-shadow: 5px 5px 5px gray; background-color: white; overflow: hidden;");


    if (clickEventListener != null && clickEventListener != undefined) {
        frame.addEvent("click", clickEventListener);
    }
    return frame;
}




/**
 * Function to create a desktop application.
 * 
 * @return {Object} - The desktop application object.
 */
function KDesktopApp() {

    // Send a message to get the wallpaper for the desktop application and broadcast it to all applications.
    let rootView = KMessage("desktop", "wallpaper", "kicsy", "kicsy", "get_wallpaper").broadcast();

    // Check if the rootView array has any elements. If it does, assign the last element to rootView. If not, create a new KLayer object and set its CSS styles.
    if (rootView.length > 0) {
        rootView = rootView[rootView.length - 1];
    } else {
        rootView = KLayer();
        rootView.addCssText("display: block; position: absolute; width: auto; height: auto;left: 0px; top: 0px; margin: 0px; padding: 0px;")
            .addCssText(" background-image: radial-gradient(at bottom,white 0%,rgb(0 0 128 / 99%) 30%);");
    }

    // Create a menu layer for the desktop application.
    let menu = KLayer();

    // Set the CSS styles for the menu layer.
    menu.addCssText("display: block; position: absolute; vertical-align: top; width: 100%; height: 200px; left: 0px; bottom: 0px; margin: 0px; padding: 4px; overflow-x: scroll; background-color: gray;")
        .addCssText("background-image: linear-gradient(navy, navy, white); box-shadow: 0px -5px 35px black;");

    // Add the menu layer to the root view layer.
    rootView.add(menu);

    // Create a new instance of the KApplicationClass with the specified properties.
    let app = new KApplicationClass("desktop", "Desktop App", ["base"], rootView);

    // Set the menu layer of the desktop application.
    app.menu = menu;

    /**
     * Function to process messages for the desktop application.
     * 
     * @param {Object} message - The message object.
     */
    app.processMessage = function (message) {
        // Process the message using the preProcessMessage method.
        app.preProcessMessage(message);

        // Switch on the action property of the message object.
        switch (message.action) {
            // If the action is "update", call the update method to update the menu of the desktop application.
            case "update":
                app.update();
                break;

            // If the action is "get_rootView", return the rootView of the desktop application.
            case "get_rootView":
                return app.rootView;
                break;

        }
    }

    /**
     * Function to update the menu of the desktop application.
     */
    app.update = function () {
        // Clear the menu of the desktop application.
        app.menu.clear();

        //Internal List of apps
        let appList = [];

        // Iterate over each application in the Kicsy.applications array.
        Kicsy.applications.forEach(application => {
            // Iterate over each environment of the current user.
            Kicsy.currentUser.environments.forEach(environment => {

                // Check if the application's environments include the current environment and if the application has a root view.
                if (application.environments.includes(environment) && application.rootView != undefined) {

                    //Check if the application is already in the list
                    if (!appList.includes(application.name)) {
                        //Add the application to the list
                        appList.push(application.name);

                        // Create an application icon for the application and add it to the menu of the desktop application.
                        let appIcon = KAppIcon(application.description, application.iconDrawer, function () { KMessage(app.name, application.name, Kicsy.currentUser.name, Kicsy.currentUser.name, "run").send(); });
                        app.menu.add(appIcon);
                    }
                }

            })
        })
    }



    // Register the desktop application.
    app.register();

    app.rootView.show();

    // Return the desktop application object.
    return app;
}
KDesktopApp();


/**
 * Function to create a Wallpaper application.
 * 
 * @return {Object} - The Wallpaper application object.
 */
(function KWallPaperApp() {
    // Create a new instance of the KLayer class to serve as the root view of the application.
    let rootView = KLayer()
        .addCssText("display: block; position: absolute; width: 100%; height: 100%;left: 0px; top: 0px; margin: 0px; padding: 0px;")
        .addCssText("overflow: hidden;")


    // Create a new instance of the KApplicationClass with the specified properties.
    let app = new KApplicationClass("wallpaper", "Wallpaper App", ["base"], rootView);

    app.setTheme = function (theme) {

        switch (theme) {

            case "night_sky":
                let colors = ["white", "yellow", "orange"];

                app.rootView
                    .addCssText("background-color: black;")
                    .addCssText("background-image: linear-gradient(to bottom, black 60%, rgb(64 0 128 / 99%) 99%);")
                    .add(
                        KCanvas()
                            .setReferenceSize(window.innerWidth, window.innerHeight)
                            .setValue(function (ctx) {

                                for (let i = 0; i < 1000; i++) {
                                    let x = Math.random() * window.innerWidth;
                                    let y = Math.random() * window.innerHeight;
                                    let o = Math.random();
                                    let indexColor = Math.floor(Math.random() * colors.length);
                                    let radius = 1; //Math.floor(1 + Math.random() * 2);
                                    ctx.beginPath();
                                    ctx.globalAlpha = o;
                                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                                    ctx.fillStyle = colors[indexColor];
                                    ctx.fill();
                                }


                                for (let i = 0; i < 100; i++) {
                                    let x = Math.random() * window.innerWidth;
                                    let y = Math.random() * window.innerHeight;
                                    let indexColor = Math.floor(Math.random() * colors.length);
                                    let radius = 2;//Math.floor(1 + Math.random() * 2);
                                    ctx.beginPath();
                                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                                    ctx.fillStyle = colors[indexColor];
                                    ctx.fill();
                                }

                                for (let i = 0; i < 10; i++) {
                                    let x = Math.random() * window.innerWidth;
                                    let y = Math.random() * window.innerHeight;
                                    let indexColor = Math.floor(Math.random() * colors.length);
                                    let radius = 3;//Math.floor(1 + Math.random() * 2);
                                    ctx.beginPath();
                                    ctx.arc(x, y, radius, 0, 2 * Math.PI);
                                    ctx.fillStyle = colors[indexColor];
                                    ctx.fill();
                                }
                            }
                            )

                    )
                break;

            case "black":
                app.rootView.dom.firstChild.kicsy
                    .addCssText("background-color: black;")
                break;

            case "white":
                app.rootView.dom.firstChild.kicsy
                    .addCssText("background-color: white;")
                break;




        }
    }


    app.setTheme("night_sky");


    /**
     * Function to process messages for the Wallpaper application.
     * 
     * @param {Object} message - The message object.
     * @return {Object} - The processed message object.
     */
    app.processMessage = function (message) {
        // Call the preProcessMessage method of the application to process the message.
        app.preProcessMessage(message);

        // Switch on the action property of the message object.
        switch (message.action) {

            // If the action is "get_wallpaper", return the root view of the application.
            case "get_wallpaper":
                return app.rootView;
                break;

            case "set_theme":
                app.setTheme(message.payload);
        }
    }

    // Register the Wallpaper application.
    app.register();

    // Return the Wallpaper application object.
    return app;
})();

