module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      hostname: String,
      ip: String,
      enabled: Boolean
    },
    { timestamps: true }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const App = mongoose.model("hosts", schema);
  return App;
};