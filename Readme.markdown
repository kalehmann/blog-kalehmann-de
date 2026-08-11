## Karsten's personal blog

This repository contains the sources of Karsten's personal blog.
The blog itself is hosted at [blog.kalehmann.de](https://blog.kalehmann.de).

### Content

The blog aims to be personal and limited in political statements.
There is no commercial intent.

Its **content is not static**.
Writing may be fixed for mistakes, assets may be converted to modern formats
and outdated content may be updated.
Changes are welcome!

### Structure

- Posts go into the [`_posts`](_posts) directory
- Audio, Images and Videos go into a subdirectory per post inside the
  [`assets`](assets) directory
    - Subdirectories inside the `assets` directory should contain at least the
      year and month of the post.
    - SVG graphics are preferred to be embedded direcly into the HTML.
      Store them into a subdirectory for the post inside `_posts/embedded` and
      include them with `{% include_relative embedded/{post}/{file}.svg %}` in
      the post.
- Structured data used in posts goes into the [`_data`](_data) directory.
- `_includes` and `_layouts` are Jekyll specific directories.
  Refer to the [Jekyll documentation][jekyll_docs] for further details.

### Development

#### Serving the content locally

After cloning the repository, first tell [`bundler`][bundler] where to install
dependencies to by executing

```
bundle config set path 'vendor'
```

Then install the dependecies with

```
bundle install
```

and serve the blog locally with

```
bundle exec jekyll serve
```

#### Adding a new post

Refer to [Jekyll's docs abouts posts][jekyll_posts].
All markdown files in the project end with `.markdown`, so please ensure the
new post also has this file extension.

If the post contains any assets, they belong in a folder `assets/{year-month-title}`.

#### Embedding images

Images are preferred to be clickable links, that means the `<img>` tag is
embedded in an `<a>`, which references the image.
This allows the user to click on the image to view it in its full size and
easily zoom in and out.

To create this construct, images should be added to posts like this:

```markdown

[![A description of the image][my_image]][my_image]

...

  [my_image]: {{ "assets/{year}-{month}-{post}/image.jpg" | absolute_url }}


```


  [bundler]: https://bundler.io/
  [jekyll_docs]: https://jekyllrb.com/docs/
  [jekyll_posts]: https://jekyllrb.com/docs/posts/
