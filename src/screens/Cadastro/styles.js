import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fa', 
        justifyContent: 'center',
        alignItems: 'center', 
        paddingTop: Platform.OS === 'android' ? 40 : 10,
    },

    // Logo
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20, 
    },
    logo: {
        width: 180,   
        height: 100,
    },

    // CARD 
    form: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 30,
        width: '90%',          
        maxWidth: 400,         
        alignSelf: 'center',   
        boxShadow: '0px 10px 30px rgba(114, 89, 193, 0.06)',
        elevation: 4, 
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginBottom: 10,
        position: 'relative',
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6fa',
        borderRadius: 18,
    },
    backButtonText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
        marginTop: -4, 
    },
    headerTitle: {
        fontSize: 22,
        color: '#1a1a1a',
        fontWeight: 'bold',
    },

    // Inputs e Rótulos
    labelInputs: {
        fontSize: 12,
        color: '#777',
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#eef0f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fafbfc',
        fontSize: 15,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eef0f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: '#fafbfc',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 15,
        color: '#333',
    },

    // Botão
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7259c1', 
        borderRadius: 14,
        paddingVertical: 16,
        marginTop: 28,
        boxShadow: '0px 6px 20px rgba(114, 89, 193, 0.25)',
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },

    footerLink: {
        alignItems: 'center',
        marginTop: 22,
        paddingVertical: 4,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerTextBold: {
        color: '#7259c1',
        fontWeight: 'bold',
    },

        // ==========================
    // TELA CADASTRO SUCESSO
    // ==========================
    successContainer: {
        flex: 1,
        backgroundColor: '#f4f6fa', // Mesmo fundo cinza claro das outras telas
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },

    card: {
        width: '100%',
        maxWidth: 380, // Mantém o tamanho perfeito de card de celular no PC
        backgroundColor: '#fff',
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 24,

        // Sombra suave flutuante
        boxShadow: '0px 10px 30px rgba(114, 89, 193, 0.08)',
        elevation: 6,
    },

    circle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#7259c1', 
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,

        
        boxShadow: '0px 6px 15px rgba(114, 89, 193, 0.3)',
        elevation: 4,
    },

    check: {
        color: '#fff',
        fontSize: 38,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: -2, 
    },

    titulo: {
        fontSize: 22,
        color: '#1a1a1a',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },

    texto: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 25,
    },

    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#efeff4', 
        marginBottom: 20,
    },

    redirect: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 15,
    },

    loadingBox: {
        width: '60%',
        height: 4,
        backgroundColor: '#efeff4',
        borderRadius: 2,
        overflow: 'hidden',
    },

    loading: {
        width: '50%', 
        height: '100%',
        backgroundColor: '#7259c1',
        borderRadius: 2,
    },

        form: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 30,
        width: '90%',          
        maxWidth: 400,         
        alignSelf: 'center',   
        boxShadow: '0px 10px 30px rgba(114, 89, 193, 0.06)',
        elevation: 4, 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginBottom: 10,
        position: 'relative',
        width: '100%',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f6fa',
        borderRadius: 18,
    },
    backButtonText: {
        fontSize: 24,
        color: '#333',
        fontWeight: 'bold',
        marginTop: -4,
    },
    headerTitle: {
        fontSize: 20,
        color: '#1a1a1a',
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginTop: 10,
        marginBottom: 10,
    },
    labelInputs: {
        fontSize: 12,
        color: '#777',
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#eef0f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fafbfc',
        fontSize: 15,
        color: '#333',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7259c1', 
        borderRadius: 14,
        paddingVertical: 16,
        marginTop: 28,
        boxShadow: '0px 6px 20px rgba(114, 89, 193, 0.25)',
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    footerLink: {
        alignItems: 'center',
        marginTop: 22,
        paddingVertical: 4,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerTextBold: {
        color: '#7259c1',
        fontWeight: 'bold',
    }

});

export default styles;
