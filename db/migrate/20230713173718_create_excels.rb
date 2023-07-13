class CreateExcels < ActiveRecord::Migration[7.0]
  def change
    create_table :excels do |t|
      t.string :column1
      t.string :column2
      t.string :column3

      t.timestamps
    end
  end
end
