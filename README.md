# Quick start
## JS
```html
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha384-tsQFqpEReu7ZLhBV2VZlAu7zcOV+rXbYlF2cqB8txI/8aZajjp4Bqd+V6D5IgvKT" crossorigin="anonymous"></script>

<script src="/js/myeval.js"></script>
<script src="/js/csvedit.js"></script>
```
## Starter template
```html
<table></table>

<script>
  $(function() {
    csvEdit.init({
      table : $('table'),
      rows : 5,
      columns : 5
    });
  });
</script>
  ```
## Authors
* **Ladygin Vladimir** — github@premiere.name
## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
