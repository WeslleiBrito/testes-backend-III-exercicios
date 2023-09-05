import { UserBusiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/user/login.dto"
import { HashManagerMock } from "../../mocks/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-fulano"
    })
  })

  test("Email não encontrados devem retornar um erro", async () => {
    expect.assertions(1)

    try {

        const input = LoginSchema.parse({
          email: "fulaninhoDa09@email.com",
          password: "fulano123"
        })

        await userBusiness.login(input)

    } catch (error) {
      expect(error).toBeDefined()
    }
  })

  test("Bloqueando o acesso sem senha válida", async () => {
    expect.assertions(1)

    try {

        const input = LoginSchema.parse({
          email: "fulano@email.com",
          password: "senha-errada"
        })

        await userBusiness.login(input)

    } catch (error) {
      expect(error).toBeDefined()
    }
  })
})