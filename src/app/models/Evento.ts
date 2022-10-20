export interface Evento {
  id: number;
  local: string;
  dataEvento?: Date;
  nome: string;
  descricao: string;
  qtdPessoas: number;
  imagemUrl: string;
  telefone: string;
  email: string;
}
