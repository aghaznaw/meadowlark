suite('"About" Page Test', function(){
  test('The page should contain link to contact page', function(){
    assert($('a[href="/contact"]').length);
  });
});
