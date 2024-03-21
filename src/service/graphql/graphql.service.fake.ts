import GraphqlService from "@service/graphql/graphql.service";

export class GraphqlServiceFake implements GraphqlService {
  send(datas: any): Promise<any> {
    if (datas.operationName === 'auth') {
      return Promise.resolve({
        "data": {
          "auth": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiZmFybyIsImlkIjoiNjVkODliOWVkY2Q4Y2JiYTlhN2NlNjUxIiwiaWF0IjoxNzA4NzYzNTgxLCJleHAiOjE3MDg3OTIzODF9.o4cQ-j1FEX0RgTYRm5R2ivt2770An_b2XHsYgmcgjdA",
            "id": "65d89b9edcd8cbba9a7ce651",
            "code": "user1",
            "name_first": "fabrice",
            "name_last": "rosito",
            "description": "description",
            "mail": "fabrice.rosito@gmail.com",
            "role": "ADMIN"
          }
        }
      });
    } else if (datas.operationName === 'getSessionInfo') {
      return Promise.resolve({
        "data": {
          "getSessionInfo": {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiZmFybyIsImlkIjoiNjVkODliOWVkY2Q4Y2JiYTlhN2NlNjUxIiwiaWF0IjoxNzA4NzYzNTgxLCJleHAiOjE3MDg3OTIzODF9.o4cQ-j1FEX0RgTYRm5R2ivt2770An_b2XHsYgmcgjdA",
            "id": "65d89b9edcd8cbba9a7ce651",
            "code": "user1",
            "name_first": "fabrice",
            "name_last": "rosito",
            "description": "description",
            "mail": "fabrice.rosito@gmail.com",
            "role": "ADMIN"
          }
        }
      });
    } else if (datas.operationName === 'systemInfo') {
      return Promise.resolve({
        "data": {
          "systemInfo": {
            "version": "0.1.0"
          }
        }
      });
    } else if (datas.operationName === 'generatePassword') {
      return Promise.resolve({
        "data": {
          "generatePassword": {
            "password": "HaHaHa"
          }
        }
      });
    } else if (datas.operationName === 'chestsForUser') {
      return Promise.resolve({
        "data": {
          "chestsForUser": [
            {
              "id": "65e0bb411a54812572091e49",
              "label": "Coffre",
              "description": "Coffre de test",
              "author_id": "65da139c45e382cdb661379f",
              "author": {
                "id": "65da139c45e382cdb661379f",
                "code": "user1"
              },
              "members": [
                {
                  "user_id": "65da139c45e382cdb661379f",
                  "user": {
                    "id": "65da139c45e382cdb661379f",
                    "code": "user1"
                  }
                },
                {
                  "user_id": "65da139c45e382cdb661379g",
                  "user": {
                    "id": "65da139c45e382cdb661379g",
                    "code": "user2"
                  }
                }
              ]
            }
          ]
        }
      });
    } else if (datas.operationName === 'thingsForChest') {
      return Promise.resolve({
        "data": {
          "thingsForChest": [
            {
              "id": "65e0bc221a54812572091e53",
              "label": "Test",
              "description": "Test",
              "author": {
                "id": "65da139c45e382cdb661379f",
                "code": "user1"
              },
              "chest": {
                "id": "65e0bb411a54812572091e49",
                "label": "Coffre"
              },
              "type": "CODE",
              "cb": null,
              "code": {
                "code": "clé 4242 clé"
              },
              "credential": null,
              "note": null,
              "totp": null
            }
          ]
        }
      });
    } else if (datas.operationName === 'create_chest') {
      return Promise.resolve({
        "data": {
          "create_chest": {
            "id": "65e0bb411a54812572091e49",
            "label": "Coffre",
            "description": "Coffre de test",
            "author_id": "65da139c45e382cdb661379f",
            "author": {
              "id": "65da139c45e382cdb661379f",
              "code": "user1"
            },
            "members": [
              {
                "user_id": "65da139c45e382cdb661379f",
                "user": {
                  "id": "65da139c45e382cdb661379f",
                  "code": "user1"
                }
              },
              {
                "user_id": "65da139c45e382cdb661379g",
                "user": {
                  "id": "65da139c45e382cdb661379g",
                  "code": "user2"
                }
              }
            ]
          }
        }
      });
    } else if (datas.operationName === 'thing') {
      return Promise.resolve({
        "data": {
          "thing": {
            "id": "65e0bc221a54812572091e53",
            "label": "Test",
            "description": "Test",
            "author": {
              "id": "65da139c45e382cdb661379f",
              "code": "user1"
            },
            "chest": {
              "id": "65e0bb411a54812572091e49",
              "label": "Coffre"
            },
            "type": "CODE",
            "cb": null,
            "code": {
              "code": "clé 4242 clé"
            },
            "credential": null,
            "note": null,
            "totp": null
          }
        }
      });
    } else if (datas.operationName === 'update_thing') {
      return Promise.resolve({
        "data": {
          "update_thing": {
            "id": "65e0bc221a54812572091e53",
            "label": "Test",
            "description": "Test",
            "author": {
              "id": "65da139c45e382cdb661379f",
              "code": "user1"
            },
            "chest": {
              "id": "65e0bb411a54812572091e49",
              "label": "Coffre"
            },
            "type": "CODE",
            "cb": null,
            "code": {
              "code": "clé 4242 clé"
            },
            "credential": null,
            "note": null,
            "totp": null
          }
        }
      });
    } else if (datas.operationName === 'delete_thing') {
      return Promise.resolve({
        "data": {
          "delete_thing": {
            "id": "65e0bc221a54812572091e53"
          }
        }
      });
    } else if (datas.operationName === 'leave_chest') {
      return Promise.resolve({
        "data": {
          "leave_chest": {
            "id": "65e0bc221a54812572091e53"
          }
        }
      });
    }

    throw new Error('Method not implemented.');
  }
} 