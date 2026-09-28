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

