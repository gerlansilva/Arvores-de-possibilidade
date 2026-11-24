#[tauri::command]
fn salvar_texto(caminho: String, conteudo: String) -> Result<(), String> {
    let destino = std::path::PathBuf::from(&caminho);
    let temporario = destino.with_extension(format!("tmp-{}", std::process::id()));
    std::fs::write(&temporario, conteudo).map_err(|erro| erro.to_string())?;
    std::fs::rename(&temporario, &destino).map_err(|erro| {
        let _ = std::fs::remove_file(&temporario);
        erro.to_string()
    })
}

#[tauri::command]
fn ler_texto(caminho: String) -> Result<String, String> {
    std::fs::read_to_string(&caminho).map_err(|erro| erro.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![salvar_texto, ler_texto])
        .run(tauri::generate_context!())
        .expect("erro ao executar a Mesa de possibilidades");
}

#[cfg(test)]
mod testes {
    use super::*;

    #[test]
    fn grava_e_le_o_mesmo_texto() {
        let caminho = std::env::temp_dir().join("mesa-teste-exportacao.json");
        let caminho = caminho.to_string_lossy().to_string();
        salvar_texto(caminho.clone(), "{\"sessoes\": []}".into()).unwrap();
        assert_eq!(ler_texto(caminho.clone()).unwrap(), "{\"sessoes\": []}");
        std::fs::remove_file(caminho).unwrap();
    }
}
