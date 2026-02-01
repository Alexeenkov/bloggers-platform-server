const ui = SwaggerUIBundle({
    spec: {
        "openapi": "3.0.0",
        "info": {
            "title": "API Documentation",
            "version": "1.0.0",
            "description": "Bloggers platform API documentation. Всё для Евгения!"
        },
        "tags": [
            {"name": "Auth"},
            {"name": "Blogs"},
            {"name": "Posts"},
            {"name": "Users"},
            {"name": "Comments"},
        ],
        "paths": {
            "/api/auth/login": {
                "post": {
                    "summary": "Проверяет введённые логин/email и пароль",
                    "tags": ["Auth"],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/LoginInputDataModel"
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Логин/email и пароль корректны. Возвращается токен доступа",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/AccessTokenResponseModel"}
                                }
                            }
                        },
                        "400": {
                            "description": "Логин/email или пароль невалидные",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Такого пользователя не существует или неправльный пароль"
                        }
                    }
                }
            },
            "/api/blogs": {
                "get": {
                    "summary": "Возвращает список всех блогов",
                    "tags": ["Blogs"],
                    "parameters": [
                        {
                            "in": "query",
                            "name": "searchNameTerm",
                            "schema": {
                                "type": "string",
                            },
                            "description": "Часть строки из названия блога. Позиция не имеет значения"
                        },
                        {
                            "in": "query",
                            "name": "pageNumber",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 1
                            },
                            "description": "Номер страницы с блогами"
                        },
                        {
                            "in": "query",
                            "name": "pageSize",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 10
                            },
                            "description": "Количество блогов на странице"
                        },
                        {
                            "in": "query",
                            "name": "sortBy",
                            "schema": {
                                "type": "string",
                                "enum": ["createdAt"],
                                "default": "createdAt"
                            },
                            "description": "По какому свойству осуществлять сортировку"
                        },
                        {
                            "in": "query",
                            "name": "sortDirection",
                            "schema": {
                                "type": "string",
                                "enum": ["asc", "desc"],
                                "default": "desc"
                            },
                            "description": "Направление сортировки (по возрастанию или убыванию)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Список всех блогов",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/BlogsListOutputWithPagination",
                                    }
                                }
                            }
                        }
                    },
                },
                "post": {
                    "summary": "Добавляет новый блог",
                    "tags": ["Blogs"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/BlogInputData"
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Блог был успешно создан",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/BlogOutputData"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        }
                    }
                }
            },
            "/api/blogs/{blogId}/posts": {
                "get": {
                    "summary": "Возвращает список всех постов для конкретного блога",
                    "tags": ["Blogs"],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "blogId",
                            "required": true,
                            "schema": {
                                "type": "string",
                            },
                            "description": "Уникальный идентификатор блога, для которого запрашивается список постов"
                        },
                        {
                            "in": "query",
                            "name": "pageNumber",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 1
                            },
                            "description": "Номер страницы с постами"
                        },
                        {
                            "in": "query",
                            "name": "pageSize",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 10
                            },
                            "description": "Количество постов на странице"
                        },
                        {
                            "in": "query",
                            "name": "sortBy",
                            "schema": {
                                "type": "string",
                                "enum": ["createdAt"],
                                "default": "createdAt"
                            },
                            "description": "По какому свойству осуществлять сортировку"
                        },
                        {
                            "in": "query",
                            "name": "sortDirection",
                            "schema": {
                                "type": "string",
                                "enum": ["asc", "desc"],
                                "default": "desc"
                            },
                            "description": "Направление сортировки (по возрастанию или убыванию)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Список всех постов для конкретного блога",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/PostsListOutputWithPagination",
                                    }
                                }
                            }
                        }
                    },
                },
                "post": {
                    "summary": "Добавляет новый пост в конкретный блог",
                    "tags": ["Blogs"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "blogId",
                            "required": true,
                            "schema": {
                                "type": "string",
                            },
                            "description": "Уникальный идентификатор блога, для которого необходимо создать пост"
                        },
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/PostInputDataForBlog"
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Пост был успешно создан",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/BlogOutputData"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Не найден блог с указанным blogId"
                        },
                    }
                }
            },
            "/api/blogs/{id}": {
                "get": {
                    "summary": "Возвращает информацию о блоге по ID",
                    "tags": ["Blogs"],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор блога",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Всё ок, вернул запрашиваемый блог",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/BlogOutputData"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого блога нет по указанному ID"
                        }
                    }
                },
                "put": {
                    "summary": "Обновляет информацию о блоге по ID",
                    "tags": ["Blogs"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор блога",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/BlogInputData"
                                }
                            }
                        }
                    },
                    "responses": {
                        "204": {
                            "description": "Блог успешно обновлён. Ничего не возвращает"
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого блога нет по указанному ID"
                        }
                    }
                },
                "delete": {
                    "summary": "Удаляет блог по ID",
                    "tags": ["Blogs"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор блога",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "responses": {
                        "204": {
                            "description": "Блог успешно удалён. Ничего не возвращает"
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого блога нет по указанному ID"
                        }
                    }
                }
            },
            "/api/posts": {
                "get": {
                    "summary": "Возвращает список всех постов",
                    "tags": ["Posts"],
                    "parameters": [
                        {
                            "in": "query",
                            "name": "pageNumber",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 1
                            },
                            "description": "Номер страницы с блогами"
                        },
                        {
                            "in": "query",
                            "name": "pageSize",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 10
                            },
                            "description": "Количество блогов на странице"
                        },
                        {
                            "in": "query",
                            "name": "sortBy",
                            "schema": {
                                "type": "string",
                                "enum": ["createdAt"],
                                "default": "createdAt"
                            },
                            "description": "По какому свойству осуществлять сортировку"
                        },
                        {
                            "in": "query",
                            "name": "sortDirection",
                            "schema": {
                                "type": "string",
                                "enum": ["asc", "desc"],
                                "default": "desc"
                            },
                            "description": "Направление сортировки (по возрастанию или убыванию)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Список всех постов",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/PostsListOutputWithPagination"
                                    }
                                }
                            }
                        }
                    }
                },
                "post": {
                    "summary": "Добавляет новый пост",
                    "tags": ["Posts"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/PostInputData"
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Пост был успешно создан",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/PostOutputData"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        }
                    }
                }
            },
            "/api/posts/{id}": {
                "get": {
                    "summary": "Возвращает информацию о посте по ID",
                    "tags": ["Posts"],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор поста",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Всё ок, вернул запрашиваемый пост",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/PostOutputData"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого поста нет по указанному ID"
                        }
                    }
                },
                "put": {
                    "summary": "Обновляет информацию о посте по ID",
                    "tags": ["Posts"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор поста",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/PostInputData"
                                }
                            }
                        }
                    },
                    "responses": {
                        "204": {
                            "description": "Пост успешно обновлён. Ничего не возвращает"
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого поста нет по указанному ID"
                        }
                    }
                },
                "delete": {
                    "summary": "Удаляет пост по ID",
                    "tags": ["Posts"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор поста",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "responses": {
                        "204": {
                            "description": "Пост успешно удалён. Ничего не возвращает"
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого поста нет по указанному ID"
                        }
                    }
                }
            },
            "/api/posts/{postId}/comments":
            {
                "get": {
                    "summary": "Возвращает список всех комментариев для конкретного поста",
                    "tags": ["Posts"],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "postId",
                            "required": true,
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            },
                            "description": "Уникальный идентификатор поста"
                        },
                        {
                            "in": "query",
                            "name": "pageNumber",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 1
                            },
                            "description": "Номер страницы с комментариями"
                        },
                        {
                            "in": "query",
                            "name": "pageSize",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 10
                            },
                            "description": "Количество комментариев на странице"
                        }, {
                            "in": "query",
                            "name": "sortBy",
                            "schema": {
                                "type": "string",
                                "enum": ["createdAt"],
                                "default": "createdAt"
                            },
                            "description": "По какому свойству осуществлять сортировку"
                        },
                        {
                            "in": "query",
                            "name": "sortDirection",
                            "schema": {
                                "type": "string",
                                "enum": ["asc", "desc"],
                                "default": "desc"
                            },
                            "description": "Направление сортировки (по возрастанию или убыванию)"
                        }],
                    "responses": {
                        "200": {
                            "description": "Список всех комментариев для конкретного поста",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CommentsListOutputWithPagination"}
                                }
                            }
                        },
                        "404": {"description": "Такого поста нет по указанному ID"}
                    }
                },
                "post": {
                    "summary": "Добавляет новый комментарий к конкретному посту",
                    "tags": ["Posts"],
                    "security": [{"BasicAuth": []}],
                    "parameters": [{
                        "in": "path",
                        "name": "postId",
                        "required": true,
                        "schema": {
                            "type": "string",
                            "example": "6830967285342d045553b95d"
                        },
                        "description": "Уникальный идентификатор поста, к которому добавляется комментарий"
                    }],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/CommentInputData"}
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Комментарий был успешно создан",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CommentOutputData"}
                                }
                            }
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/ValidationErrorResponse"}
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого поста нет по указанному ID"
                        }
                    }
                }
            },
            "/api/comments/{id}": {
                "get": {
                    "summary": "Возвращает информацию о комментарии по ID",
                    "tags": ["Comments"],
                    "parameters": [{
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "description": "Уникальный идентификатор комментария",
                        "schema": {
                            "type": "string",
                            "example": "6830967285342d045553b95d"
                        }
                    }],
                    "responses": {
                        "200": {
                            "description": "Всё ок, вернул запрашиваемый комментарий",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/CommentOutputData"}
                                }
                            }
                        },
                        "404": {"description": "Такого комментария нет по указанному ID"}
                    }
                },
                "put": {
                    "summary": "Обновляет комментарий по ID",
                    "tags": ["Comments"],
                    "security": [{"BasicAuth": []}],
                    "parameters": [{
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "description": "Уникальный идентификатор комментария",
                        "schema": {

                            "type": "string",
                            "example": "6830967285342d045553b95d"
                        }
                    }],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/CommentInputData"}
                            }
                        }
                    },
                    "responses": {
                        "204": {
                            "description": "Комментарий успешно обновлён. Ничего не возвращает"
                        },
                        "400": {
                            "description": "Не прошёл валидацию. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {"$ref": "#/components/schemas/ValidationErrorResponse"}
                                }
                            }
                        },
                        "401": {"description": "Не прошёл авторизацию"},
                        "403": {"description": "Попытка изменить чужой комментарий"},
                        "404": {"description": "Такого комментария нет по указанному ID"}
                    }
                },
                "delete": {
                    "summary": "Удаляет комментарий по ID",
                    "tags": ["Comments"],
                    "security": [{"BasicAuth": []}],
                    "parameters": [{
                        "in": "path",
                        "name": "id",
                        "required": true,
                        "description": "Уникальный идентификатор комментария",
                        "schema": {
                            "type": "string",
                            "example": "6830967285342d045553b95d"
                        }
                    }], "responses": {
                        "204": {"description": "Комментарий успешно удалён. Ничего не возвращает"},
                        "401": {"description": "Не прошёл авторизацию"},
                        "403": {"description": "Попытка удалить чужой комментарий"},
                        "404": {"description": "Такого комментария нет по указанному ID"}
                    }
                }
            },
            "/api/users": {
                "get": {
                    "summary": "Возвращает список всех пользователей",
                    "tags": ["Users"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "query",
                            "name": "searchLoginTerm",
                            "schema": {
                                "type": "string",
                            },
                            "description": "Часть строки из логина. Позиция не имеет значения"
                        },
                        {
                            "in": "query",
                            "name": "searchEmailTerm",
                            "schema": {
                                "type": "string",
                            },
                            "description": "Часть строки из email. Позиция не имеет значения"
                        },
                        {
                            "in": "query",
                            "name": "pageNumber",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 1
                            },
                            "description": "Номер страницы с пользователями"
                        },
                        {
                            "in": "query",
                            "name": "pageSize",
                            "schema": {
                                "type": "integer",
                                "minimum": 1,
                                "default": 10
                            },
                            "description": "Количество пользователей на странице"
                        },
                        {
                            "in": "query",
                            "name": "sortBy",
                            "schema": {
                                "type": "string",
                                "enum": ["createdAt"],
                                "default": "createdAt"
                            },
                            "description": "По какому свойству осуществлять сортировку"
                        },
                        {
                            "in": "query",
                            "name": "sortDirection",
                            "schema": {
                                "type": "string",
                                "enum": ["asc", "desc"],
                                "default": "desc"
                            },
                            "description": "Направление сортировки (по возрастанию или убыванию)"
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Список всех пользователей",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/UsersListOutputWithPagination",
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        }
                    },
                },
                "post": {
                    "summary": "Добавляет нового пользователя",
                    "tags": ["Users"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/UserInputData"
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Пользователь был успешно создан",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/UserOutputData"
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Не прошёл валидацию или такой логин/email уже существуют. В схеме запроса описаны требования к передаваемым данным",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "$ref": "#/components/schemas/ValidationErrorResponse"
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        }
                    }
                }
            },
            "/api/users/{id}": {
                "delete": {
                    "summary": "Удаляет пользователя по ID",
                    "tags": ["Users"],
                    "security": [
                        {
                            "BasicAuth": []
                        }
                    ],
                    "parameters": [
                        {
                            "in": "path",
                            "name": "id",
                            "required": true,
                            "description": "Уникальный идентификатор пользователя",
                            "schema": {
                                "type": "string",
                                "example": "6830967285342d045553b95d"
                            }
                        }
                    ],
                    "responses": {
                        "204": {
                            "description": "Пользователь успешно удалён. Ничего не возвращает"
                        },
                        "401": {
                            "description": "Не прошёл авторизацию"
                        },
                        "404": {
                            "description": "Такого пользователя нет по указанному ID"
                        }
                    }
                }
            },
        },
        "components": {
            "securitySchemes": {
                "BasicAuth": {
                    "type": "http",
                    "scheme": "basic"
                }
            },
            "schemas": {
                "LoginInputDataModel": {
                    "type": "object",
                    "required": ["loginOrEmail", "password"],
                    "properties": {
                        "loginOrEmail": {
                            "type": "string",
                        },
                        "password": {
                            "type": "string",
                            "minLength": 6,
                            "maxLength": 20,
                        },
                    }
                },
                "AccessTokenResponseModel":
                {
                    "type": "object",
                    "required": ["accessToken"],
                    "properties": {
                        "accessToken": {
                            "type": "string",
                            "description": "JWT токен доступа",
                            "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        }
                    }
                },
                "BlogOutputData": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Уникальный идентификатор",
                            "example": "6830967285342d045553b95d"
                        },
                        "name": {
                            "type": "string",
                            "description": "Полное название блога",
                            "example": "Блог обо мне"
                        },
                        "description": {
                            "type": "string",
                            "description": "Описание блога",
                            "example": "Блог о том, как не быть придурком, если вы уже придурок"
                        },
                        "websiteUrl": {
                            "type": "string",
                            "description": "Ссылка на сторонний ресурс, которую нужно указать для блога",
                            "example": "https://example.com",
                            "pattern": "/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]*)*$/"
                        },
                        "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2025-05-22T12:34:04.402Z",
                        },
                        "isMembership": {
                            "type": "boolean",
                            "description": "True, если у пользователя не истек срок действия подписки на блог",
                        }
                    }
                },
                "BlogInputData": {
                    "type": "object",
                    "required": ["name", "description", "websiteUrl"],
                    "properties": {
                        "name": {
                            "type": "string",
                            "maxLength": 15,
                            "description": "Полное название блога",
                            "example": "Блог обо мне"
                        },
                        "description": {
                            "type": "string",
                            "maxLength": 500,
                            "description": "Описание блога",
                            "example": "Блог о том, как не быть придурком, если вы уже придурок"
                        },
                        "websiteUrl": {
                            "type": "string",
                            "maxLength": 100,
                            "description": "Ссылка на сторонний ресурс, которую нужно указать для блога",
                            "example": "https://example.com",
                            "pattern": "/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]*)*$/"
                        }
                    }
                },
                "BlogsListOutputWithPagination": {
                    "type": "object",
                    "properties": {
                        "pageNumber": {
                            "type": "integer",
                            "example": 1
                        },
                        "pageSize": {
                            "type": "integer",
                            "example": 10
                        },
                        "pageCount": {
                            "type": "integer",
                            "description": "Общее количество страниц",
                            "example": 5
                        },
                        "totalCount": {
                            "type": "integer",
                            "description": "Общее количество элементов на всех страницах",
                            "example": 100
                        },
                        "items": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/BlogOutputData"
                            }
                        },
                    }
                },
                "PostOutputData": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "description": "Уникальный идентификатор",
                            "example": "683b5000f0bba410f89171dd"
                        },
                        "title": {
                            "type": "string",
                            "description": "Заголовок поста"
                        },
                        "shortDescription": {
                            "type": "string",
                            "description": "Короткое описание поста"
                        },
                        "content": {
                            "type": "string",
                            "description": "Содержимое поста"
                        },
                        "blogId": {
                            "type": "string",
                            "example": "6830967285342d045553b95d",
                            "description": "Уникальный идентификатор блога, к которому относится данный пост"
                        },
                        "blogName": {
                            "type": "string",
                            "description": "Название блога, к которому относится данный пост"
                        },
                        "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2025-05-22T12:34:04.402Z",
                        }
                    }
                },
                "PostInputData": {
                    "type": "object",
                    "required": [
                        "title",
                        "shortDescription",
                        "content",
                        "blogId"
                    ],
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Заголовок поста",
                            "maxLength": 30
                        },
                        "shortDescription": {
                            "type": "string",
                            "description": "Короткое описание поста",
                            "maxLength": 100
                        },
                        "content": {
                            "type": "string",
                            "description": "Содержимое поста",
                            "maxLength": 1000
                        },
                        "blogId": {
                            "type": "string",
                            "example": "6830967285342d045553b95d",
                            "description": "Уникальный идентификатор блога, к которому относится данный пост"
                        }
                    }
                },
                "PostInputDataForBlog": {
                    "type": "object",
                    "required": [
                        "title",
                        "shortDescription",
                        "content"
                    ],
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "Заголовок поста",
                            "maxLength": 30
                        },
                        "shortDescription": {
                            "type": "string",
                            "description": "Короткое описание поста",
                            "maxLength": 100
                        },
                        "content": {
                            "type": "string",
                            "description": "Содержимое поста",
                            "maxLength": 1000
                        }
                    }
                },
                "PostsListOutputWithPagination": {
                    "type": "object",
                    "properties": {
                        "pageNumber": {
                            "type": "integer",
                            "example": 1
                        },
                        "pageSize": {
                            "type": "integer",
                            "example": 10
                        },
                        "pageCount": {
                            "type": "integer",
                            "description": "Общее количество страниц",
                            "example": 5
                        },
                        "totalCount": {
                            "type": "integer",
                            "description": "Общее количество элементов на всех страницах",
                            "example": 100
                        },
                        "items": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/PostOutputData"
                            }
                        },
                    }
                },
                "UserOutputData": {
                    "type": "object",
                    "properties": {
                        "id": {
                            "type": "string",
                            "example": "683b5000f0bba410f89171dd"
                        },
                        "login": {
                            "type": "string",
                        },
                        "email": {
                            "type": "string",
                        },
                        "createdAt": {
                            "type": "string",
                            "format": "date-time",
                            "example": "2025-05-22T12:34:04.402Z",
                        }
                    }
                },
                "UserInputData": {
                    "type": "object",
                    "required": [
                        "login",
                        "email",
                        "password",
                    ],
                    "properties": {
                        "login": {
                            "type": "string",
                            "minLength": 3,
                            "maxLength": 10,
                            "pattern": "/^[a-zA-Z0-9_-]*$/",
                            "description": "Должен быть уникальным",
                        },
                        "email": {
                            "type": "string",
                            "pattern": "/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/",
                            "example": "example@example.com",
                            "description": "Должен быть уникальным",
                        },
                        "password": {
                            "type": "string",
                            "minLength": 6,
                            "maxLength": 20,
                        },
                    }
                },
                "UsersListOutputWithPagination": {
                    "type": "object",
                    "properties": {
                        "pageNumber": {
                            "type": "integer",
                            "example": 1
                        },
                        "pageSize": {
                            "type": "integer",
                            "example": 10
                        },
                        "pageCount": {
                            "type": "integer",
                            "description": "Общее количество страниц",
                            "example": 5
                        },
                        "totalCount": {
                            "type": "integer",
                            "description": "Общее количество элементов на всех страницах",
                            "example": 100
                        },
                        "items": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/UserOutputData"
                            }
                        },
                    }
                },
                "CommentatorInfo": {"type": "object", "properties": {"userId": {"type": "string", "example": "6830967285342d045553b95d"}, "userLogin": {"type": "string", "example": "john_doe"}}}, "CommentOutputData": {"type": "object", "properties": {"id": {"type": "string", "description": "Уникальный идентификатор комментария", "example": "6830967285342d045553b95d"}, "content": {"type": "string", "description": "Содержимое комментария", "minLength": 20, "maxLength": 300}, "commentatorInfo": {"$ref": "#/components/schemas/CommentatorInfo"}, "createdAt": {"type": "string", "format": "date-time", "example": "2025-05-22T12:34:04.402Z"}}}, "CommentInputData": {"type": "object", "required": ["content"], "properties": {"content": {"type": "string", "description": "Содержимое комментария", "minLength": 20, "maxLength": 300}}}, "CommentsListOutputWithPagination": {"type": "object", "properties": {"pageNumber": {"type": "integer", "example": 1}, "pageSize": {"type": "integer", "example": 10}, "pageCount": {"type": "integer", "description": "Общее количество страниц", "example": 5}, "totalCount": {"type": "integer", "description": "Общее количество элементов на всех страницах", "example": 100}, "items": {"type": "array", "items": {"$ref": "#/components/schemas/CommentOutputData"}}}}, "ValidationError": {
                    "type": "object",
                    "properties": {
                        "field": {
                            "type": "string",
                            "example": "name"
                        },
                        "message": {
                            "type": "string",
                            "example": "Invalid name"
                        }
                    }
                },
                "ValidationErrorResponse": {
                    "type": "object",
                    "properties": {
                        "errorsMessages": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/ValidationError"
                            }
                        }
                    }
                }
            }
        }
    },
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
    ],
    plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout",
    showCommonExtensions: true
})
// End Swagger UI call region

window.ui = ui