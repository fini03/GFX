-- claim section --

All tasks T1, T2, T3, T4 and T5(a, b) have been fully implemented. Also the Extra Credit (B1) has been fully implemented.

By default the MODE_CAMERA is selected which means the arrow keys will move the camera around.

-- tested environments --

The assignment was created on endeavourOS (version: 6.1.8-arch1-1, graphic card: Intel Corporation HD Graphics 620 (rev 02), browser: Mozilla Firefox 109.0) tested on arch linux (version: 6.2.2-arch1-1, graphic card: Intel Corporation UHD Graphics 620 (rev 07), browser: Mozilla Firefox 110.0.1 and Chromium 111.0.5563.64). It was also tested on Windows 11 Pro with Firefox (Firefox version: 92.0, graphic card: Intel Corporation HD Graphics 620 (rev 02)).

-- additional and general remarks --

Please serve from a webserver:
    - python -m http.server

Initial page: index.html

Usage of OBJParser:
    - Select a shape [1-9]
    - Click on the 'Choose OBJ file' button
    - Choose an OBJ file you want to load

The coordinate system has been taken out in this task since it's not longer needed.

Shadow maps:

Backfaces are culled for shadow maps in order to not draw erronous self-shadows, so shadows will only  be correct for closed-surface objects (e.g. the Bunny obj is not closed and will have weird shadows).

If you have the shadows activated and you press `w, e, r, t` to switch between the shaders you won't have any shadows (they are toggled). If you want to show the shadow press the `h` key again.

Also for the shadow maps this tutorial has been used: https://xem.github.io/articles/webgl-guide-part-2.html#3b. The `unpackDepth` method and also the basic.frag shader were also taken from this tutorial. Certain shadow artifacts don't show up in the phong shading because of the bias calculation. The used bias formula (in phong shading) was taken from: https://learnopengl.com/Advanced-Lighting/Shadows/Shadow-Mapping.

For the assignment only the vertex array object from WebGL2 was used. It was chosen to simplify the vertex data management (put all of the necessary vertex data for the application into a single object) and for better code organization (using the VAO to store all the vertex attribute bindings). The rest of the code is still written according to WebGL standards.

One thing that might make the assignment easier understandable if some pictures or short snippets on how the "endproduct" should look/work were provided. I found myself wondering if I was on the right track at times and having a clear example to reference would have been nice.

Overall I had a great time working on the assignment! I really enjoyed working on it. It was fun to see the results and I gained a lot of valuable knowledge :).
