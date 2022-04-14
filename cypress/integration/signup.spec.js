import signupPage from '../support/pages/signup'

describe('cadastro', () => {

    context('quando o usuario é novato', () => {
        const user = {
            name: 'Danilo Brito',
            email: 'danilo@samuraibs.com',
            password: 'pwd123'
        }

        before(() => {
            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })
        })

        it('cadastro com sucesso', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Agora você se tornou um(a) Samurai, faça seu login para ver seus agendamentos!')
        })
    })

    context('quando o email ja existe', () => {
        const user = {
            name: 'Bete Brito',
            email: 'bete@samuraibs.com',
            password: 'pwd123',
            is_provider: true
        }

        before(() => {

            cy.task('removeUser', user.email)
                .then(function (result) {
                    console.log(result)
                })

            cy.request(
                'POST',
                'http://localhost:3333/users',
                user
            ).then(function (response) {
                expect(response.status).to.eq(200)
            })
        })


        it('nao deve cadastrar o usuario', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.toast.shouldHaveText('Email já cadastrado para outro usuário.')
        })
    })

    context('quando o email esta incorreto', () => {
        const user = {
            name: 'Carlos Alberto',
            email: 'carlos.alberto.com',
            password: 'pwd123',
        }

        it('deve exibir mensagem de alerta', () => {
            signupPage.go()
            signupPage.form(user)
            signupPage.submit()
            signupPage.alertHaveText('Informe um email válido')
        })
    })

    context('quando a senha tem menos de 6 caracteres', () => {

        const passwords = ['1', '12', '123', '1abc', '12345']

        beforeEach(() => {
            signupPage.go()
        })

        passwords.forEach((p) => {
            it('nao deve cadastrar com a senha: ' + p, () => {
                const user = {
                    name: 'Carlos Alberto',
                    email: 'carlos@gmail.com',
                    password: p
                }

                signupPage.form(user)
                signupPage.submit()
            })
        })

        afterEach(() => {
            signupPage.alertHaveText('Pelo menos 6 caracteres')
        })
    })

    context('quando nao preencho nenhum campo', () => {
        const alertMessages = [
            'Nome é obrigatório',
            'E-mail é obrigatório',
            'Senha é obrigatória'
        ]
        
        before(()=>{
            signupPage.go()
            signupPage.submit()
        })


        alertMessages.forEach((alert)=>{
            it('deve exibir ' + alert.toLowerCase(), ()=>{
                signupPage.alertHaveText(alert)
            })
        })
        
    })
})

