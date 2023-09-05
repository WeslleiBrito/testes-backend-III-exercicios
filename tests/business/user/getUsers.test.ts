import { UserBusiness } from "../../../src/business/UserBusiness"
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto"
import { USER_ROLES } from "../../../src/models/User"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar lista de todos users", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-astrodev"
    })

    const output = await userBusiness.getUsers(input)

    expect(output).toHaveLength(2)
    expect(output).toEqual([
      {
        id: "id-mock-fulano",
        name: "Fulano",
        email: "fulano@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.NORMAL
      },
      {
        id: "id-mock-astrodev",
        name: "Astrodev",
        email: "astrodev@email.com",
        createdAt: expect.any(String),
        role: USER_ROLES.ADMIN
      },
    ])
  })

  test("Garantindo que tokens inválidos gerem erros", async () => {
    expect.assertions(1)

    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-invalido"
      })
  
      await userBusiness.getUsers(input)
    } catch (error) {
      expect(error).toBeDefined()
    }
   
  })

  test("Garantido que só admins acessem os dados dos usuários", async () => {
    expect.assertions(1)

    try {
      const input = GetUsersSchema.parse({
        token: "token-mock-fulano"
      })
  
      await userBusiness.getUsers(input)
    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})