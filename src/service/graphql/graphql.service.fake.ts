import GraphqlService from "@service/graphql/graphql.service";

export class GraphqlServiceFake implements GraphqlService {
  send(datas: any): Promise<any> {
    if (datas.operationName === 'auth') {
      return Promise.resolve({
        "data": {
          "auth": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiZmFybyIsImlkIjoiNjVkODliOWVkY2Q4Y2JiYTlhN2NlNjUxIiwiaWF0IjoxNzA4NzYzNTgxLCJleHAiOjE3MDg3OTIzODF9.o4cQ-j1FEX0RgTYRm5R2ivt2770An_b2XHsYgmcgjdA",
            "id": "65d89b9edcd8cbba9a7ce651",
            "code": "faro",
            "name_first": "fabrice",
            "name_last": "rosito",
            "description": "description",
            "mail": "fabrice.rosito@gmail.com",
            "role": "ADMIN"
          }
        }
      });
    }
    throw new Error('Method not implemented.');
  }
} 