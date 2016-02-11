{
  'targets': [
    {
      'target_name': 'test',
      'type': 'shared_library',
      'product_prefix': 'lib',
      'sources': [ 'libtest.c' ],
      'conditions': [
        [ 'OS=="mac"', {
          'product_extension': 'dylib',
        }],
        [ 'OS=="win"', {
          'product_extension': 'dll',
        }],
        [ 'OS!="mac" and OS!="win"', {
          'product_extension': 'so',
        }],
      ],
    },
  ]
}
