import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/organisms/card";
import { Button } from "../components/atoms/button";
import { useToast } from "../components/organisms/use-toast";
import { useData } from "../app/contexts/DataContext";
import { Progress } from "../components/molecules/progress";

const AIRecommendations = () => {
  const { companies, products } = useData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState("");

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      const prompt = `
Tengo un catálogo de productos con estas características:

${JSON.stringify(products, null, 2)}

Basado en este catálogo, dame entre 3 y 5 recomendaciones de productos nuevos que podrían complementar o mejorar el inventario actual. Por cada recomendación, incluye:

- "product": nombre del producto recomendado
- "reason": por qué lo recomiendas
- "confidenceScore": un valor estimado entre 70 y 100 sobre la confianza de esa recomendación
`;

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN_OPENAI}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        }
      );

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        const text = data.choices[0].message.content;
        setRecommendations(text);
      } else {
        toast({
          title: "Error al generar recomendaciones",
          description: "La respuesta del modelo fue vacía.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al generar recomendaciones",
        description: "Ocurrió un problema al comunicarse con la API de OpenAI.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Recomendaciones de IA</h1>
        <p className="text-muted-foreground">
          Productos recomendados por nuestro sistema de inteligencia artificial
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Motor de Recomendaciones</CardTitle>
            <CardDescription>
              Nuestro sistema analiza tu inventario actual y tendencias del
              mercado
            </CardDescription>
          </div>
          <Button
            onClick={generateRecommendations}
            disabled={loading}
            className="bg-inventario-600 hover:bg-inventario-700"
          >
            {loading ? "Analizando..." : "Analizar Inventario"}
          </Button>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Analizando datos de productos y tendencias del mercado...
              </p>
              <Progress value={45} className="h-2" />
            </div>
          )}

          {!loading && recommendations.length === 0 && (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="font-medium text-lg mb-2">
                Aún no hay recomendaciones
              </h3>
              <p className="text-muted-foreground mb-4">
                Haz clic en "Analizar Inventario" para generar recomendaciones
                inteligentes
              </p>
              <Button
                onClick={generateRecommendations}
                className="bg-inventario-600 hover:bg-inventario-700"
              >
                Analizar ahora
              </Button>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="space-y-4 whitespace-pre-line">
              <h3 className="text-lg font-medium">
                Productos recomendados para añadir a tu catálogo:
              </h3>
              <div
                className="text-sm text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: recommendations.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendations;
