#! /usr/bin/env ruby
# Copyright (c) 2018 by Karsten Lehmann <mail@kalehmann.de>

require 'open3'

# This class can be used to render a svg image from a LaTeX formula
class Latex2Svg
  TEMP_DIR_NAME = ".tmp-latex2svg"
  LATEX_FILE_NAME = "#{TEMP_DIR_NAME}/file.ltx"
  DVI_FILE_NAME = "#{TEMP_DIR_NAME}/file.dvi"
  private_constant :TEMP_DIR_NAME
  private_constant :LATEX_FILE_NAME
  private_constant :DVI_FILE_NAME

  def initialize(latex_formula)
    @latex = get_latex(latex_formula)
  end

  def self.from_file(path)
    if !File.exist?(path)
      raise IOError("File #{path} not found.")
    end

    input_file = File.open(path, "r")
    formula = input_file.read()
    input_file.close()

    return Latex2Svg.new(formula)
  end

  def create_svg()
    create_temp_dir()
    create_latex_file
    render_latex_to_dvi()
    dvi2svg()
    remove_temp_dir()

    return @svg
  end

  def write_svg(path)
    svg_file = File.new(path, "w")
    unless defined? @svg
      create_svg()
    end
    svg_file.write(@svg)
    svg_file.close()
  end

  private
  def get_latex(latex_formula)
    latex = <<EOF
\\documentclass[landscape]{article}
\\usepackage[landscape]{geometry}
\\usepackage{amsmath}
\\pagenumbering{gobble}

\\begin{document}
#{latex_formula}
\\end{document}
EOF
    return latex
  end

  def create_latex_file()
    ltx_file = File.new(LATEX_FILE_NAME, "w")
    ltx_file.write(@latex)
    ltx_file.close()
  end

  def render_latex_to_dvi()
    Open3.popen3(
      'latex',
      '-output-format=dvi',
      "-output-directory=#{TEMP_DIR_NAME}",
      LATEX_FILE_NAME
    ) do |i,o,e,t|
      o.read()
    end
  end

  def dvi2svg()
    Open3.popen3(
      'dvisvgm',
      '-s',
      '--no-fonts',
      DVI_FILE_NAME
    ) do |i,o,e,t|
      xml_start = "<?xml "
      # Remove possible errors from dvisvgm
      @svg = o.read().partition(xml_start)[2].prepend(xml_start)
    end
  end

  def create_temp_dir()
    system(
      'mkdir',
      '-p',
      TEMP_DIR_NAME
    )
  end

  def remove_temp_dir()
    system(
      'rm',
      '-rf',
      TEMP_DIR_NAME
    )
  end
end

def handle_input()
  args = ARGF.argv
  if args.length !=2
    puts "Usage #{$0} input.ltx output.svg"
    exit(1)
  end

  input_file = args[0]
  output_file = args[1]

  return input_file, output_file
end

if __FILE__ == $0
  input_file, output_file = handle_input()
  Latex2Svg.from_file(input_file).write_svg(output_file)
end
