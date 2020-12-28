load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

#TODO add a genrule to call the yarn install (on the source directory!) as a tool to produce some output... make a few things dependent on it...

nodejs_binary(
    name = "rollup_bin",
    entry_point = "//:node_modules/rollup/bin/rollup",
    # Point bazel to your node_modules to find the entry point
    data = ["//:node_modules"],
)
