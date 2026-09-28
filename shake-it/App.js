import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Accelerometer } from "expo-sensors";

export default function App() {
  const [tela, setTela] = useState("inicio");

  const [opcoes, setOpcoes] = useState([
    { id: "1", nome: "Pizza", emoji: "🍕" },
    { id: "2", nome: "Sushi", emoji: "🍣" },
    { id: "3", nome: "Hambúrguer", emoji: "🍔" },
    { id: "4", nome: "Salada", emoji: "🥗" },
    { id: "5", nome: "Sorvete", emoji: "🍦" },
  ]);

  const [resultado, setResultado] = useState(null);
  const [modal, setModal] = useState(false);
  const [novaOpcao, setNovaOpcao] = useState("");
  const [sensorAtivo, setSensorAtivo] = useState(false);


  // ACELERÔMETRO
  

  useEffect(() => {
    if (!sensorAtivo) return;

    let ultimoMovimento = 0;

    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const movimento = Math.sqrt(x * x + y * y + z * z);
      const agora = Date.now();

      if (movimento > 1.8 && agora - ultimoMovimento > 1200) {
        ultimoMovimento = agora;

        const sorteado =
          opcoes[Math.floor(Math.random() * opcoes.length)];

        setResultado(sorteado);
        setSensorAtivo(false);
        setTela("resultado");
      }
    });

    return () => subscription.remove();
  }, [sensorAtivo, opcoes]);

  
  // INICIAR


  const iniciarDecisao = async () => {
    if (opcoes.length === 0) {
      setTela("semOpcoes");
      return;
    }

    const disponivel = await Accelerometer.isAvailableAsync();

    if (!disponivel) {
      setTela("erroSensor");
      return;
    }

    setTela("detectando");
    setSensorAtivo(true);
  };

  
  // ADICIONAR OPÇÃO


  function adicionarOpcao() {
    if (!novaOpcao.trim()) return;

    setOpcoes([
      ...opcoes,
      {
        id: Date.now().toString(),
        nome: novaOpcao.trim(),
        emoji: "✨",
      },
    ]);

    setNovaOpcao("");
    setModal(false);
  }

  
  // EXCLUIR


  function excluirOpcao(id) {
    setOpcoes(opcoes.filter((item) => item.id !== id));
  }

  // TELA 1 - INÍCIO
  

  if (tela === "inicio") {
    return (
      <View style={styles.tela}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.bolhaTop} />
        <View style={styles.bolhaTop2} />
        <View style={styles.bolhaBottom} />

        <View style={styles.inicioCentro}>

          <View style={styles.celularInicio}>
            <Ionicons
              name="phone-portrait-outline"
              size={65}
              color="#dc2778"
            />

            <View style={styles.ondaEsquerda}>
              <Text style={styles.ondaTexto}>))</Text>
            </View>

            <View style={styles.ondaDireita}>
              <Text style={styles.ondaTexto}>((</Text>
            </View>
          </View>

          <Text style={styles.logoShake}>Shake</Text>
          <Text style={styles.logoIt}>It</Text>

          <Text style={styles.fraseLogo}>
            Balançou, escolheu!
          </Text>

          <Text style={styles.descricaoInicio}>
            Cadastre suas opções e deixe{"\n"}
            o acelerômetro fazer a escolha{"\n"}
            por você.
          </Text>

          <Botao
            texto="Começar"
            onPress={() => setTela("opcoes")}
          />
        </View>
      </View>
    );
  }


  // TELA 2 - OPÇÕES

  if (tela === "opcoes") {
    return (
      <View style={styles.tela}>
        <StatusBar barStyle="light-content" />

        <View style={styles.header}>
          <Pressable onPress={() => setTela("inicio")}>
            <Ionicons
              name="chevron-back"
              size={30}
              color="white"
            />
          </Pressable>

          <Text style={styles.headerTitulo}>
            Minhas Opções
          </Text>

          <Pressable onPress={() => setModal(true)}>
            <Ionicons
              name="add-circle"
              size={30}
              color="white"
            />
          </Pressable>
        </View>

        <FlatList
          data={opcoes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <View style={styles.cardOpcao}>

              <View style={styles.iconeOpcao}>
                <Text style={styles.emoji}>
                  {item.emoji}
                </Text>
              </View>

              <Text style={styles.nomeOpcao}>
                {item.nome}
              </Text>

              <Pressable
                onPress={() => excluirOpcao(item.id)}
              >
                <Ionicons
                  name="trash-outline"
                  size={23}
                  color="#ed6ca5"
                />
              </Pressable>
            </View>
          )}
        />

        <View style={styles.botaoInferior}>
          <Botao
            texto="📱   Iniciar Decisão"
            onPress={() => {
              if (opcoes.length === 0) {
                setTela("semOpcoes");
              } else {
                setTela("preparar");
              }
            }}
          />
        </View>

        <Modal
          visible={modal}
          transparent
          animationType="fade"
        >
          <View style={styles.fundoModal}>
            <View style={styles.modal}>

              <Text style={styles.tituloModal}>
                Nova opção
              </Text>

              <TextInput
                value={novaOpcao}
                onChangeText={setNovaOpcao}
                placeholder="Ex: Cinema"
                placeholderTextColor="#c58aa6"
                style={styles.input}
              />

              <Botao
                texto="Adicionar"
                onPress={adicionarOpcao}
              />

              <Pressable
                onPress={() => setModal(false)}
                style={styles.cancelarModal}
              >
                <Text style={styles.cancelarTexto}>
                  Cancelar
                </Text>
              </Pressable>

            </View>
          </View>
        </Modal>
      </View>
    );
  }

  
  // TELA 3 - PRONTO PARA BALANÇ

  if (tela === "preparar") {
    return (
      <View style={styles.tela}>
        <Header
          titulo="Shake It"
          voltar={() => setTela("opcoes")}
        />

        <View style={styles.preparar}>

          <View style={styles.iconeGrande}>
            <Ionicons
              name="phone-portrait-outline"
              size={80}
              color="#d91b72"
            />

            <Text style={styles.ondasCelular}>
              ))  ((
            </Text>
          </View>

          <Text style={styles.tituloRosa}>
            Pronto para balançar!
          </Text>

          <Text style={styles.textoRosa}>
            Segure o celular com firmeza{"\n"}
            e balance para que o sensor{"\n"}
            detecte o movimento.
          </Text>

          <Pressable
            style={styles.botaoClaro}
            onPress={() => setTela("opcoes")}
          >
            <Text style={styles.textoBotaoClaro}>
              Cancelar
            </Text>
          </Pressable>

          <Pressable
            style={styles.botaoComecar}
            onPress={iniciarDecisao}
          >
            <Text style={styles.textoBotao}>
              Começar
            </Text>
          </Pressable>

        </View>
      </View>
    );
  }

  
  // TELA 4 - DETECTANDO
  

  if (tela === "detectando") {
    return (
      <View style={styles.telaDetectando}>

        <Text style={styles.tituloDetectando}>
          Shake It
        </Text>

        <View style={styles.circulo1}>
          <View style={styles.circulo2}>
            <View style={styles.circulo3}>
              <Ionicons
                name="phone-portrait-outline"
                size={85}
                color="white"
              />
            </View>
          </View>
        </View>

        <Text style={styles.movimento}>
          Detectando movimento...
        </Text>

        <View style={styles.sensorAtivo}>
          <Ionicons
            name="pulse-outline"
            size={30}
            color="white"
          />

          <Text style={styles.sensorTexto}>
            Acelerômetro ativo
          </Text>
        </View>

      </View>
    );
  }

  
  // TELA 5 - RESULTADO
  

  if (tela === "resultado") {
    return (
      <View style={styles.tela}>

        <Header
          titulo="Shake It"
          voltar={() => setTela("opcoes")}
        />

        <View style={styles.resultado}>

          <View style={styles.resultadoCirculo}>
            <Text style={styles.resultadoEmoji}>
              {resultado?.emoji}
            </Text>
          </View>

          <Text style={styles.voceEscolheu}>
            Você escolheu:
          </Text>

          <Text style={styles.resultadoNome}>
            {resultado?.nome}
          </Text>

          <Botao
            texto="↻   Nova Decisão"
            onPress={() => setTela("opcoes")}
          />

        </View>
      </View>
    );
  }

  // TELA 7 - ERRO SENSOR


  if (tela === "erroSensor") {
    return (
      <View style={styles.tela}>

        <Header
          titulo="Shake It"
          voltar={() => setTela("opcoes")}
        />

        <View style={styles.erroCentro}>

          <View style={styles.iconeErro}>
            <Ionicons
              name="phone-portrait-outline"
              size={70}
              color="#d91b72"
            />

            <View style={styles.alerta}>
              <Text style={styles.alertaTexto}>
                !
              </Text>
            </View>
          </View>

          <Text style={styles.tituloErro}>
            Sensor indisponível
          </Text>

          <Text style={styles.textoErro}>
            Não foi possível acessar o{"\n"}
            acelerômetro do seu dispositivo.{"\n"}
            Verifique se o sensor está disponível{"\n"}
            ou se a permissão foi concedida.
          </Text>

          <Botao
            texto="Voltar"
            onPress={() => setTela("opcoes")}
          />

        </View>
      </View>
    );
  }


  // TELA 8 - SEM OPÇÕES


  if (tela === "semOpcoes") {
    return (
      <View style={styles.tela}>

        <Header
          titulo="Shake It"
          voltar={() => setTela("opcoes")}
        />

        <View style={styles.erroCentro}>

          <View style={styles.iconeErro}>
            <Ionicons
              name="list-outline"
              size={75}
              color="#d91b72"
            />

            <View style={styles.alerta}>
              <Text style={styles.alertaTexto}>
                !
              </Text>
            </View>
          </View>

          <Text style={styles.tituloErro}>
            Nenhuma opção cadastrada
          </Text>

          <Text style={styles.textoErro}>
            Você precisa adicionar pelo menos{"\n"}
            uma opção para fazer uma escolha.
          </Text>

          <Botao
            texto="Voltar"
            onPress={() => setTela("opcoes")}
          />

        </View>
      </View>
    );
  }

  return null;
}

// COMPONENTES
function Botao({ texto, onPress }) {
  return (
    <Pressable
      style={styles.botao}
      onPress={onPress}
    >
      <Text style={styles.textoBotao}>
        {texto}
      </Text>
    </Pressable>
  );
}

function Header({ titulo, voltar }) {
  return (
    <View style={styles.header}>

      <Pressable onPress={voltar}>
        <Ionicons
          name="chevron-back"
          size={30}
          color="white"
        />
      </Pressable>

      <Text style={styles.headerTitulo}>
        {titulo}
      </Text>

      <View style={{ width: 30 }} />

    </View>
  );
}

// ESTILOS


const styles = StyleSheet.create({

  tela: {
    flex: 1,
    backgroundColor: "#fde7f1",
  },

  // INÍCIO

  bolhaTop: {
    position: "absolute",
    width: 260,
    height: 150,
    backgroundColor: "#f8c9df",
    top: -50,
    left: -50,
    borderRadius: 100,
  },

  bolhaTop2: {
    position: "absolute",
    width: 190,
    height: 120,
    backgroundColor: "#f9d6e7",
    top: -35,
    right: -30,
    borderRadius: 100,
  },

  bolhaBottom: {
    position: "absolute",
    width: 240,
    height: 120,
    backgroundColor: "#f8c9df",
    bottom: -50,
    left: -60,
    borderRadius: 100,
  },

  inicioCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  celularInicio: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  ondaEsquerda: {
    position: "absolute",
    left: -10,
  },

  ondaDireita: {
    position: "absolute",
    right: -10,
  },

  ondaTexto: {
    color: "#d91b72",
    fontSize: 28,
    fontWeight: "900",
  },

  logoShake: {
    color: "#d91b72",
    fontSize: 56,
    fontWeight: "900",
    fontStyle: "italic",
    lineHeight: 58,
  },

  logoIt: {
    color: "#d91b72",
    fontSize: 55,
    fontWeight: "900",
    fontStyle: "italic",
  },

  fraseLogo: {
    color: "#df2779",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 12,
  },

  descricaoInicio: {
    textAlign: "center",
    color: "#9f3968",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 15,
    marginBottom: 25,
  },

  // HEADER 

  header: {
    height: 90,
    paddingTop: 28,
    paddingHorizontal: 20,
    backgroundColor: "#d91b72",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitulo: {
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  // OPÇÕES

  lista: {
    padding: 15,
    paddingBottom: 120,
  },

  cardOpcao: {
    height: 62,
    backgroundColor: "#fff",
    borderRadius: 17,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
  },

  iconeOpcao: {
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: "#fde0ed",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  emoji: {
    fontSize: 25,
  },

  nomeOpcao: {
    flex: 1,
    color: "#222",
    fontSize: 15,
    fontWeight: "600",
  },

  botaoInferior: {
    position: "absolute",
    bottom: 22,
    left: 20,
    right: 20,
  },

  // BOTÃO 

  botao: {
    width: "100%",
    height: 52,
    backgroundColor: "#df2779",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  textoBotao: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },

  // MODAL

  fundoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
  },

  modal: {
    width: "100%",
    backgroundColor: "#fde7f1",
    borderRadius: 25,
    padding: 25,
  },

  tituloModal: {
    color: "#c31868",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },

  input: {
    height: 52,
    backgroundColor: "white",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: "#333",
  },

  cancelarModal: {
    alignItems: "center",
    padding: 15,
  },

  cancelarTexto: {
    color: "#d91b72",
    fontWeight: "700",
  },

  // PREPARAR

  preparar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  iconeGrande: {
    width: 170,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#f8c8df",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  ondasCelular: {
    position: "absolute",
    color: "#d91b72",
    fontSize: 28,
    fontWeight: "900",
  },

  tituloRosa: {
    color: "#b30f5c",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 15,
  },

  textoRosa: {
    color: "#a03b68",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 30,
  },

  botaoClaro: {
    width: "90%",
    height: 52,
    borderRadius: 28,
    backgroundColor: "#f7b6d3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  textoBotaoClaro: {
    color: "#c91b69",
    fontSize: 15,
    fontWeight: "800",
  },

  botaoComecar: {
    width: "90%",
    height: 52,
    borderRadius: 28,
    backgroundColor: "#df2779",
    alignItems: "center",
    justifyContent: "center",
  },

  // DETECTANDO 

  telaDetectando: {
    flex: 1,
    backgroundColor: "#d91b72",
    alignItems: "center",
    justifyContent: "center",
  },

  tituloDetectando: {
    position: "absolute",
    top: 65,
    color: "white",
    fontSize: 18,
    fontWeight: "800",
  },

  circulo1: {
    width: 310,
    height: 310,
    borderRadius: 160,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  circulo2: {
    width: 225,
    height: 225,
    borderRadius: 120,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  circulo3: {
    width: 145,
    height: 145,
    borderRadius: 80,
    backgroundColor: "#eb4c93",
    alignItems: "center",
    justifyContent: "center",
  },

  movimento: {
    color: "white",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 40,
  },

  sensorAtivo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  sensorTexto: {
    color: "white",
    marginLeft: 8,
    fontSize: 14,
  },

  // RESULTADO 

  resultado: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  resultadoCirculo: {
    width: 190,
    height: 160,
    borderRadius: 100,
    backgroundColor: "#f9c8df",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  resultadoEmoji: {
    fontSize: 100,
  },

  voceEscolheu: {
    color: "#b5125f",
    fontSize: 18,
    fontWeight: "700",
  },

  resultadoNome: {
    color: "#d91b72",
    fontSize: 32,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 35,
  },

  // ERROS

  erroCentro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  iconeErro: {
    width: 160,
    height: 150,
    borderRadius: 90,
    backgroundColor: "#f8c8df",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  alerta: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#d91b72",
    alignItems: "center",
    justifyContent: "center",
  },

  alertaTexto: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
  },

  tituloErro: {
    color: "#b5125f",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 15,
  },

  textoErro: {
    color: "#9f3968",
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    marginBottom: 30,
  },
});
