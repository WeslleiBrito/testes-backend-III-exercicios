import { ProductBusiness } from '../../../src/business/ProductBusiness'
import { IdGeneratorMock } from '../../mocks/IdGeneratorMock'
import { ProductDatabaseMock } from '../../mocks/ProductDatabaseMock'
import { TokenManagerMock } from '../../mocks/TokenManagerMock'
import { BaseError } from '../../../src/errors/BaseError'
import { CreateProductOutputDTO, CreateProductSchema } from '../../../src/dtos/product/createProduct.dto'

const productBusiness = new ProductBusiness(
  new ProductDatabaseMock(),
  new IdGeneratorMock(),
  new TokenManagerMock()
)

describe("Testando o createProducts", () => {

    test("Teste de sucesso na criação", async () => {

        const output = await productBusiness.createProduct(
            {
                name: "Ventilador",
                price: 130,
                token: "token-mock-astrodev"
            }
        )
        const result: CreateProductOutputDTO = {
            message: "Producto cadastrado com sucesso",
            product: {
                id: "id-mock",
                name: "Ventilador",
                price: 130,
                createdAt: expect.any(String)
            }
        }
        expect(output).toEqual(result)
    })

    test("Teste de garantia de que o token não é válido", async () => {
        expect.assertions(2)
        try {

            const input = CreateProductSchema.parse(
                {
                    name: "Ventilador",
                    price: 130,
                    token: "token-falso"
                }
            )

            await productBusiness.createProduct(input) 

        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(BaseError)
        }
    })

    test("Teste de garantia de que qualquer usuário não admin, não pode fazer cadastro de novos produtos", async () => {
        expect.assertions(2)
        try {

            const input = CreateProductSchema.parse(
                {
                    name: "Ventilador",
                    price: 130,
                    token: "token-mock-fulano"
                }
            )

            await productBusiness.createProduct(input) 

        } catch (error) {
            expect(error).toBeDefined()
            expect(error).toBeInstanceOf(BaseError)
        }
    })
})