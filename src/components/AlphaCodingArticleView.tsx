import { AlphaCodingArticle } from "@/services/alphacodingskills";
import { BookOpen, Code2, Lightbulb } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AlphaCodingArticleViewProps {
  article: AlphaCodingArticle;
}

const AlphaCodingArticleView = ({ article }: AlphaCodingArticleViewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card border border-blue-500/30 rounded-xl p-6 sm:p-8 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-300 mb-2">{article.title}</h1>
            <p className="text-muted-foreground text-sm sm:text-base">{article.content}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      {article.sections.map((section, index) => (
        <div key={index} className="glass-card border border-border/50 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-blue-500 rounded"></div>
            {section.heading}
          </h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {section.content.split('\n').map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>
          {section.code && (
            <div className="mt-4">
              <SyntaxHighlighter
                language={section.language || 'javascript'}
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {section.code}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      ))}

      {/* Code Examples */}
      {article.examples.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground flex items-center gap-2">
            <Code2 className="w-6 h-6 text-blue-400" />
            Code Examples
          </h2>
          {article.examples.map((example, index) => (
            <div key={index} className="glass-card border border-blue-500/30 rounded-xl overflow-hidden backdrop-blur-md">
              <div className="bg-blue-500/10 px-6 py-4 border-b border-blue-500/30">
                <h3 className="text-lg font-semibold text-blue-300">{example.title}</h3>
              </div>
              <div className="p-6 space-y-4">
                <SyntaxHighlighter
                  language={example.language}
                  style={vscDarkPlus}
                  customStyle={{
                    borderRadius: '0.5rem',
                    padding: '1.5rem',
                    fontSize: '0.875rem',
                    margin: 0,
                  }}
                  showLineNumbers
                >
                  {example.code}
                </SyntaxHighlighter>
                <div className="flex items-start gap-3 p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                  <Lightbulb className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{example.explanation}</p>
                </div>
                {example.output && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-foreground mb-2">Output:</p>
                    <div className="bg-black/50 rounded-lg p-4 border border-green-500/30">
                      <code className="text-green-400 text-sm font-mono">{example.output}</code>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Related Topics */}
      {article.relatedTopics.length > 0 && (
        <div className="glass-card border border-border/50 rounded-xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-foreground mb-4">Related Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {article.relatedTopics.map((topic, index) => (
              <a
                key={index}
                href={`https://www.alphacodingskills.com/${article.language}/${topic.slug}.php`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-lg border border-border/50 hover:border-blue-400 bg-background/50 hover:bg-blue-500/10 transition-all group"
              >
                <h3 className="font-semibold text-foreground group-hover:text-blue-300 transition-colors mb-1">
                  {topic.title}
                </h3>
                <p className="text-xs text-muted-foreground">{topic.description}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlphaCodingArticleView;
