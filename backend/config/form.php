<?php
return [
    'products' => [
        'fields' => [
            'name' => [
                'type' => 'string',
                'label' => 'Название',
                'required' => true
            ],
            'description' => [
                'type' => 'string',
                'label' => 'Описание',
                'required' => false
            ],
            'price' => [
                'type' => 'number',
                'label' => 'Цена',
                'required' => true
            ],
            'img' => [
                'type' => 'image',
                'label' => 'Изображение',
                'required' => false
            ],
            'country_id' => [
                'type' => 'select',
                'label' => 'Страна',
                'required' => false
            ],
            'author' => [
                'type' => 'string',
                'label' => 'Автор',
                'required' => true
            ]
        ]
    ],
    'countries' => [
        'coll' => [
            'name' => [
                'type' => 'string',
                'label' => 'Название',
                'required' => true
            ],
            'description' => [
                'type' => 'text',
                'label' => 'Описание',
                'required' => false
            ]
        ]
    ]
];
