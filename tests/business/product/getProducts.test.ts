import { ProductBusiness } from '../../../src/business/ProductBusiness'
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock'
import { ProductDatabaseMock } from '../../mocks/ProductDatabaseMock'
import { TokenManagerMock } from '../../mocks/TokenManagerMock'
import { BaseError } from '../../../src/errors/BaseError'

const productBusiness = new ProductBusiness(
  new ProductDatabaseMock(),
  new IdGeneratorMock(),
  new TokenManagerMock()
)

describe("Testando getProducts", () => {
  

  test("Teste de sucesso para busca de um produto", async () => {

    const output = await productBusiness.getProducts({
      token: "token-mock-astrodev",
      q: "Teclado"
    })

    expect(output).toEqual(
      [{
        id: 'p002',
        name: 'Teclado',
        price: 80,
        createdAt: expect.any(String)
      }]
    )

  })

  test("Teste de sucesso para busca de vários produtos", async () => {

    const output = await productBusiness.getProducts({
      token: "token-mock-astrodev",
      q: ""
    })

    expect(output).toEqual(
      [
        {
          id: 'p001',
          name: 'Mouse',
          price: 50,
          createdAt: expect.any(String)
        },
        {
          id: 'p002',
          name: 'Teclado',
          price: 80,
          createdAt: expect.any(String)
        },
      ]
    )

  })

  test("Token inválido", async () => {
    
    expect.assertions(2)
    try {
      const output = await productBusiness.getProducts({
        token: "qualquer-coisa",
        q: ""
      })
    } catch (error) {
      expect(error).toBeDefined()
      expect(error).toBeInstanceOf(BaseError)
    }
  })
})